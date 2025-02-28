import { useEffect, useState } from "react";

export default function EVSurvery({ onGetData }) {
  const [evChoice, setEvChoice] = useState(null);
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    onGetData({ evChoice, ageGroup });
  }, [evChoice, ageGroup]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto">
      <h2 className="text-xl text-center font-semibold mb-4">
        Electric Vehicle Survey
      </h2>
      <div className=" flex items-center gap-4">
        {/* EV Choice */}
        <div className="mb-4 flex-1">
          <p className="mb-2">
            Do you wish to buy an electric vehicle in the future?
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${evChoice === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setEvChoice(1)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${evChoice === 0 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setEvChoice(0)}
            >
              No
            </button>
          </div>
        </div>

        {/* Age Group */}
        <div className="flex-1">
          <p className="mb-2">Age:</p>
          <select
            className="w-full p-2 border rounded-lg"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="">Select Age Group</option>
            <option value="15-25">15-25</option>
            <option value="26-35">26-35</option>
            <option value="35+">35+</option>
          </select>
        </div>
      </div>
    </div>
  );
}
