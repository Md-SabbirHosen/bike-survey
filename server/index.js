const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Survey Schema
const surveySchema = new mongoose.Schema({
  name: String,
  phone: String,
  bikeType: String,
  rankings: Array,
  productFeatures: Array,
  evSurvey: {
    evChoice: Number,
    ageGroup: String,
  },
});

const Survey = mongoose.model("Survey", surveySchema);

app.use(cors({ origin: "http://localhost:5173/", credentials: true }));
// app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());

const excelFilePath = path.join(__dirname, "survey_data.xlsx");

if (!fs.existsSync(excelFilePath)) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    [
      "Personal Information",
      "",
      "",
      "Rankings",
      ...Array(15).fill(""),
      "Product Features",
      ...Array(15 * 3).fill(""),
      "Survey Data",
      "",
      "",
    ],
    [
      "Name",
      "Phone",
      "Bike Type",
      ...Array(15)
        .fill()
        .map((_, i) => `Row ${i + 1}`),
      ...Array(15).flatMap((_, i) => [
        `Feature ${i + 1} Importance`,
        `Feature ${i + 1} Satisfaction`,
        `Feature ${i + 1} Fulfillment`,
      ]),
      "Age",
      "Buy Vehicle in Future?",
    ],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
  XLSX.writeFile(wb, excelFilePath);
}

app.post("/submit-survey", async (req, res) => {
  try {
    const {
      name,
      phone,
      bikeType,
      rankings = [],
      productFeatures = [],
      evSurvey = {},
    } = req.body;
    const { evChoice = "", ageGroup = "" } = evSurvey;

    console.log("Received Data:", req.body);

    // Save to MongoDB
    const newSurvey = new Survey({
      name,
      phone,
      bikeType,
      rankings,
      productFeatures,
      evSurvey,
    });
    await newSurvey.save();

    let wb, ws;

    // **Product Feature Headers**
    const productFeatureHeadersTitle = [
      "Speed",
      "Charging time",
      "Eco-Friendly",
      "Mileage",
      "Seat capacity",
      "Brand",
      "Design",
      "Battery",
      "Weight",
      "Safety",
      "Price",
      "Maintenance",
      "Social value",
      "Re-sell value",
      "Overall satisfaction",
    ];

    const productFeatureHeaders = productFeatureHeadersTitle.flatMap(
      (feature) => [
        `${feature} Importance Level`,
        `${feature} Satisfaction Level`,
        `${feature} Fulfillment Capacity`,
      ]
    );

    const headerRow2 = [
      "Name",
      "Phone",
      "Bike Type",
      ...Array(15)
        .fill("")
        .map((_, i) => `Row ${i + 1}`), // Rankings (15 columns)
      ...productFeatureHeaders, // Product Features (45 columns)
      "Age",
      "Buy Vehicle in Future",
    ];

    // **Check if Excel File Exists**
    if (!fs.existsSync(excelFilePath)) {
      wb = XLSX.utils.book_new();
      const headerRow1 = [
        "Personal Information",
        "",
        "",
        "Rankings",
        ...Array(14).fill(""),
        "Product Features",
        ...Array(44).fill(""),
        "Survey Data",
        "",
        "",
      ];
      ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2]);
      XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
    } else {
      wb = XLSX.readFile(excelFilePath);
      ws = wb.Sheets["Survey Data"];
    }

    // **Ensure rankingsData has 15 columns**
    const rankingsData = Array(15)
      .fill("")
      .map((_, i) => rankings[i]?.rank || "");

    // **Ensure productFeaturesData has 45 columns**
    let productFeaturesData = productFeatureHeadersTitle.flatMap((_, i) => {
      return [
        productFeatures[i]?.importanceLevel || "",
        productFeatures[i]?.satisfactionLevel || "",
        productFeatures[i]?.fulfillmentCapacity || "",
      ];
    });

    // **Fix Length to 45 Columns**
    while (productFeaturesData.length < 45) {
      productFeaturesData.push("");
    }

    // **Construct rowData with correct columns**
    let rowData = [
      name,
      phone,
      bikeType,
      ...rankingsData, // Rankings (15 columns)
      ...productFeaturesData, // Product Features (45 columns)
      ageGroup, // Survey Data
      evChoice, // Survey Data
    ];

    // **Fix length to exactly 65 columns**
    while (rowData.length < 65) {
      rowData.push("");
    }

    // **Debugging Logs**
    console.log("Product Features Data Processed:", productFeaturesData);
    console.log("Final Row Data:", rowData);
    console.log(
      "Row Data Length:",
      rowData.length,
      "Expected:",
      headerRow2.length
    );

    // **Get current range & append new row**
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const nextRow = range.e.r + 1;
    XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: nextRow });

    // **Merge Header Cells**
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 17 } },
      { s: { r: 0, c: 18 }, e: { r: 0, c: 62 } },
      { s: { r: 0, c: 63 }, e: { r: 0, c: 64 } }
    );

    // **Write to Excel**
    XLSX.writeFile(wb, excelFilePath);
    console.log("Survey data saved successfully!");

    res.status(200).json({ message: "Survey submitted successfully!" });
  } catch (error) {
    console.error("Error saving survey data:", error);
    res.status(500).json({ error: "Failed to save survey data" });
  }
});
app.get("/download-excel", (req, res) => {
  res.download(excelFilePath, "survey_data.xlsx");
});

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "..", "/client/dist");

  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
