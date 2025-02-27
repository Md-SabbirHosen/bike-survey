import React from "react";

const DownloadSurvey = () => {
  const downloadDataHandler = () => {
    window.open("http://localhost:8080/download-excel", "_blank");
  };
  return (
    <div className="text-center">
      <button
        onClick={downloadDataHandler}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transform transition hover:scale-105"
      >
        Download Survey Data
      </button>
    </div>
  );
};

export default DownloadSurvey;
