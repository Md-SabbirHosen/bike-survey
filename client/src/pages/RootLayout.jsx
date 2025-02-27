import { motion } from "framer-motion";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import InfluenceFactors from "../components/InfluenceFactors";
import PersonalInfo from "../components/PersonalInfo";
import ProductFeatures from "../components/ProductFeatures";
import RankingTable from "../components/RankingTable";

function RootLayout() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bikeType: "",
    rankings: Array(15).fill({ Row: "" }),
    productFeatures: Array(15).fill({
      importanceLevel: "",
      satisfactionLevel: "",
      fulfillmentCapacity: "",
    }),
  });

  const path = window.location.pathname;

  const handlePersonalInfoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRankingChange = (index, rank) => {
    setFormData((prev) => {
      const newRankings = [...prev.rankings];

      if (rank !== "") {
        newRankings.forEach((item, i) => {
          if (i !== index && item.rank === parseInt(rank)) {
            item.rank = "";
          }
        });
      }
      newRankings[index] = { rank };
      return { ...prev, rankings: newRankings };
    });
  };

  const handleProductFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const newFeatures = [...prev.productFeatures];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, productFeatures: newFeatures };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const surveyData = {
      name: formData.name,
      phone: formData.phone,
      bikeType: formData.bikeType,
      rankings: formData.rankings.map((r) => ({ rank: r.rank })),
      productFeatures: formData.productFeatures.map((f) => ({
        importanceLevel: f.importanceLevel,
        satisfactionLevel: f.satisfactionLevel,
        fulfillmentCapacity: f.fulfillmentCapacity,
      })),
    };

    console.log(surveyData);

    try {
      const backendUrl =
        import.meta.env.MODE === "development"
          ? "http://localhost:8080/submit-survey"
          : "/submit-survey";

      const response = await fetch(`${backendUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        alert("Survey submitted successfully!");
      } else {
        alert("Failed to submit survey.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Header />
          <PersonalInfo
            formData={formData}
            onChange={handlePersonalInfoChange}
          />
          <RankingTable
            rankings={formData.rankings}
            onRankingChange={handleRankingChange}
          />

          <InfluenceFactors />
          <ProductFeatures
            features={formData.productFeatures}
            onChange={handleProductFeatureChange}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            {path !== "/download-survey" && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transform transition hover:scale-105"
              >
                Submit Survey
              </button>
            )}
          </motion.div>
        </form>
      </div>
      <Outlet />
    </div>
  );
}

export default RootLayout;
