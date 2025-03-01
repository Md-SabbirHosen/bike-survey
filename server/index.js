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

// app.use(cors({ origin: "http://localhost:5173/", credentials: true }));
app.use(cors({ origin: "*", credentials: true }));
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

    res.status(200).json({ message: "Survey submitted successfully!" });
  } catch (error) {
    console.error("Error saving survey data:", error);
    res.status(500).json({ error: "Failed to save survey data" });
  }
});

app.get("/download-excel", async (req, res) => {
  try {
    const surveys = await Survey.find();

    // Define headers
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

    // Create product feature subheaders (for row 2)
    const productFeatureSubHeaders = productFeatureHeadersTitle.flatMap(
      (feature) => [
        feature, // Title
        "Importance Level",
        "Satisfaction Level",
        "Fulfillment Capacity",
      ]
    );

    // First header row - main sections
    const headerRow1 = [
      "Personal Information", // spans 3 columns
      "",
      "",
      "Rankings", // spans 15 columns
      ...Array(14).fill(""),
      "Product Features", // spans 60 columns (15 features × 4 columns each)
      ...Array(59).fill(""),
      "Survey Data", // spans 2 columns
      "",
    ];

    // Second header row - column titles
    const headerRow2 = [
      "Name",
      "Phone",
      "Bike Type",
      ...Array(15) // Rankings columns
        .fill("")
        .map((_, i) => `Row ${i + 1}`),
      ...productFeatureSubHeaders, // All product feature columns with subheaders
      "Age",
      "Buy Vehicle in Future",
    ];

    let wb, ws;

    // Create new workbook with proper headers
    wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2]);
    XLSX.utils.book_append_sheet(wb, ws, "Survey Data");

    // Process all surveys
    for (const survey of surveys) {
      // Ensure rankingsData has 15 columns
      const rankingsData = Array(15)
        .fill("")
        .map((_, i) => {
          return survey.rankings && survey.rankings[i]
            ? survey.rankings[i].rank
            : "";
        });

      // Process product features data - ensuring all 60 columns (15 features × 4 columns)
      let productFeaturesData = [];

      // Properly map through all 15 product features
      for (let i = 0; i < 15; i++) {
        const feature =
          survey.productFeatures && survey.productFeatures[i]
            ? survey.productFeatures[i]
            : {};

        productFeaturesData.push(
          productFeatureHeadersTitle[i], // Add feature name in first column
          feature.importanceLevel || "",
          feature.satisfactionLevel || "",
          feature.fulfillmentCapacity || ""
        );
      }

      // Extract survey data correctly from the DB structure
      const ageGroup =
        survey.ageGroup || (survey.evSurvey ? survey.evSurvey.ageGroup : "");
      const evChoice =
        survey.evChoice !== undefined
          ? survey.evChoice
          : survey.evSurvey && survey.evSurvey.evChoice !== undefined
            ? survey.evSurvey.evChoice
            : "";

      // Construct rowData with correct columns
      let rowData = [
        survey.name || "",
        survey.phone || "",
        survey.bikeType || "",
        ...rankingsData,
        ...productFeaturesData,
        ageGroup,
        evChoice.toString(), // Convert to string in case it's a number
      ];

      // Get current range & append new row
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
      const nextRow = range.e.r + 1;
      XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: nextRow });

      console.log(`Added survey for ${survey.name || "unnamed user"}`);
    }

    // Correct merge cells for header rows
    ws["!merges"] = [
      // Row 1 merges
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Personal Information (3 cols)
      { s: { r: 0, c: 3 }, e: { r: 0, c: 17 } }, // Rankings (15 cols)
      { s: { r: 0, c: 18 }, e: { r: 0, c: 77 } }, // Product Features (60 cols)
      { s: { r: 0, c: 78 }, e: { r: 0, c: 79 } }, // Survey Data (2 cols)
    ];

    // For each product feature in Row 2, merge the feature name cell with the next 3 cells
    for (let i = 0; i < 15; i++) {
      const startCol = 18 + i * 4; // Start at column 18, each feature takes 4 columns
      ws["!merges"].push({
        s: { r: 1, c: startCol },
        e: { r: 1, c: startCol + 3 },
      });
    }

    // Write to Excel
    XLSX.writeFile(wb, excelFilePath);
    console.log(
      `Successfully saved ${surveys.length} survey entries to Excel!`
    );

    // Send file as download
    res.download(excelFilePath, "survey_data.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  } catch (error) {
    console.error("Error saving survey data:", error);
    res.status(500).json({ error: "Failed to save survey data" });
  }
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
