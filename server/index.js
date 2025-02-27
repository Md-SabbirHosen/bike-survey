const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    ],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
  XLSX.writeFile(wb, excelFilePath);
}

app.post("/submit-survey", (req, res) => {
  const {
    name,
    phone,
    bikeType,
    rankings = [],
    productFeatures = [],
  } = req.body;

  console.log("Received Data:", req.body);

  try {
    let wb;
    let ws;

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
      ];

      const productFeatureHeadersTitle = [
        "Speed-",
        "Charging time-",
        "Eco-Friendly-",
        "Mileage-",
        "Seat capacity-",
        "Brand-",
        "Design-",
        "Battery-",
        "Weight-",
        "Safety-",
        "Price-",
        "Maintenance-",
        "Social value-",
        "Re-sell value-",
        "Overall satisfaction-",
      ];
      const productFeatureHeaders = [];
      for (let i = 0; i < 15; i++) {
        productFeatureHeaders.push(
          `${productFeatureHeadersTitle[i]} Importance Level`,
          `${productFeatureHeadersTitle[i]} Satisfaction Level`,
          `${productFeatureHeadersTitle[i]} Fulfillment Capacity`
        );
      }

      const headerRow2 = [
        "Name",
        "Phone",
        "Bike Type",
        ...Array(15)
          .fill("")
          .map((_, i) => `Row ${i + 1}`),
        ...productFeatureHeaders,
      ];

      ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2]);
      XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
    } else {
      wb = XLSX.readFile(excelFilePath);
      ws = wb.Sheets["Survey Data"];
    }

    if (!ws) {
      ws = XLSX.utils.aoa_to_sheet([
        [
          "Personal Information",
          "",
          "",
          "Rankings",
          ...Array(14).fill(""),
          "Product Features & Buying Factors",
          ...Array(14).fill(""),
        ],
        [
          "Name",
          "Phone",
          "Bike Type",
          ...Array(15)
            .fill("")
            .map((_, i) => `Rank ${i + 1}`),
          ...Array(15).flatMap((_, i) => [
            `Importance ${i + 1}`,
            `Satisfaction ${i + 1}`,
            `Fulfillment ${i + 1}`,
          ]),
        ],
      ]);
      XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
    }

    const rankingsData = Array(15)
      .fill("")
      .map((_, i) => rankings[i]?.rank || "");

    const productFeaturesData = productFeatures.flatMap((feature) => [
      feature.importanceLevel || "",
      feature.satisfactionLevel || "",
      feature.fulfillmentCapacity || "",
    ]);

    const rowData = [
      name,
      phone,
      bikeType,
      ...rankingsData,
      ...productFeaturesData,
    ];

    XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });

    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 17 } },
      { s: { r: 0, c: 18 }, e: { r: 0, c: 62 } }
    );

    XLSX.writeFile(wb, excelFilePath);
    console.log("Data saved successfully!");

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
