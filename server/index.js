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
app.use(bodyParser.json());

// File path for storing survey data
const excelFilePath = path.join(__dirname, "survey_data.xlsx");

// Ensure the file exists
if (!fs.existsSync(excelFilePath)) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Name", "Phone", "Bike Type", "Rankings", "Product Features"],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Survey Data");
  XLSX.writeFile(wb, excelFilePath);
}

// Handle survey submission
app.post("/submit-survey", (req, res) => {
  const { name, phone, bikeType, rankings, productFeatures } = req.body;

  try {
    // Load existing Excel file
    const wb = XLSX.readFile(excelFilePath);
    const ws = wb.Sheets["Survey Data"];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Convert rankings & product features to a string format
    const rankingsString = rankings.map((r) => r.rank || "").join(", ");
    const productFeaturesString = productFeatures
      .map(
        (f) =>
          `${f.importanceLevel}, ${f.satisfactionLevel}, ${f.fulfillmentCapacity}`
      )
      .join(" | ");

    // Append new row
    data.push([name, phone, bikeType, rankingsString, productFeaturesString]);

    // Write back to the Excel file
    const newWs = XLSX.utils.aoa_to_sheet(data);
    wb.Sheets["Survey Data"] = newWs;
    XLSX.writeFile(wb, excelFilePath);

    res.status(200).json({ message: "Survey submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save survey data" });
  }
});

// Endpoint to download the Excel file
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
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
