import { motion } from "framer-motion";

const tableData = [
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "12,000-35,000",
    socialValue: "5",
    resellValue: "3",
    ecoFriendly: "No",
  },
  {
    price: "90,000-150,000",
    mileage: "55",
    maintenance: "6,000-25,000",
    socialValue: "5",
    resellValue: "8",
    ecoFriendly: "No",
  },
  {
    price: "90,000-150,000",
    mileage: "75",
    maintenance: "12,000-35,000",
    socialValue: "5",
    resellValue: "3",
    ecoFriendly: "Yes",
  },
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "12,000-35,000",
    socialValue: "7",
    resellValue: "3",
    ecoFriendly: "Yes",
  },
  {
    price: "90,000-150,000",
    mileage: "75",
    maintenance: "12,000-35,000",
    socialValue: "7",
    resellValue: "8",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "12,000-35,000",
    socialValue: "7",
    resellValue: "8",
    ecoFriendly: "Yes",
  },
  {
    price: "150,000-250,00",
    mileage: "75",
    maintenance: "6,000-25,000",
    socialValue: "7",
    resellValue: "3",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "6,000-25,000",
    socialValue: "5",
    resellValue: "8",
    ecoFriendly: "Yes",
  },
  {
    price: "90,000-150,000",
    mileage: "55",
    maintenance: "12,000-35,000",
    socialValue: "7",
    resellValue: "8",
    ecoFriendly: "Yes",
  },
  {
    price: "90,000-150,000",
    mileage: "75",
    maintenance: "6,000-25,000",
    socialValue: "5",
    resellValue: "3",
    ecoFriendly: "Yes",
  },
  {
    price: "90,000-150,000",
    mileage: "55",
    maintenance: "6,000-25,000",
    socialValue: "7",
    resellValue: "3",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "6,000-25,000",
    socialValue: "7",
    resellValue: "3",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "55",
    maintenance: "6,000-25,000",
    socialValue: "5",
    resellValue: "3",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "75",
    maintenance: "12,000-35,000",
    socialValue: "5",
    resellValue: "8",
    ecoFriendly: "No",
  },
  {
    price: "150,000-250,00",
    mileage: "75",
    maintenance: "6,000-25,000",
    socialValue: "7",
    resellValue: "8",
    ecoFriendly: "Yes",
  },
];

export default function RankingTable({ rankings, onRankingChange }) {
  const usedRanks = rankings.map((r) => r.rank).filter((rank) => rank !== "");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto"
    >
      <h2 className="text-xl text-center font-semibold mb-4">
        Please rank among the alternatives for buying two-wheeler motorbike:
      </h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">SL</th>
            <th className="border p-2">Price (tk)</th>
            <th className="border p-2">Mileage (Km/l Crg)</th>
            <th className="border p-2">Maintenance (tk)</th>
            <th className="border p-2">Social value perspective (out of 10)</th>
            <th className="border p-2">Resell value perspective (out of 10)</th>
            <th className="border p-2">Eco-friendly</th>
            <th className="border p-2">Rank</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{row.price}</td>
              <td className="border p-2">{row.mileage}</td>
              <td className="border p-2">{row.maintenance}</td>
              <td className="border p-2 text-center">{row.socialValue}</td>
              <td className="border p-2 text-center">{row.resellValue}</td>
              <td className="border p-2 text-center">{row.ecoFriendly}</td>
              <td className="border p-2">
                <select
                  className="w-18 p-1 border rounded"
                  value={rankings[index]?.rank || ""}
                  onChange={(e) => onRankingChange(index, e.target.value)}
                >
                  <option value="">Select</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const rankValue = i + 1;
                    const isDisabled =
                      usedRanks.includes(rankValue.toString()) &&
                      rankings[index]?.rank !== rankValue.toString();
                    return (
                      <option
                        key={rankValue}
                        value={rankValue}
                        disabled={isDisabled}
                      >
                        {rankValue}
                      </option>
                    );
                  })}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
