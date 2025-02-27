import { motion } from "framer-motion";

const features = [
  { id: 1, name: "Speed", description: "The speed of the e-bike" },
  {
    id: 2,
    name: "Charging time",
    description: "The time it takes to be charged",
  },
  { id: 3, name: "Eco-Friendly", description: "Low carbon discharge" },
  {
    id: 4,
    name: "Mileage",
    description: "The distance coverage in a charge			",
  },
  {
    id: 5,
    name: "Seat capacity",
    description: "5.	Seat capacity	How many people can ride at a time",
  },
  { id: 6, name: "Brand", description: "The brand of e-bike" },

  { id: 7, name: "Design", description: "The looking of the e-bike" },
  { id: 8, name: "Battery", description: "Capacity of the battery" },
  { id: 9, name: "Weight", description: "Weight of the e-bike" },
  {
    id: 10,
    name: "Safety",
    description: "Breaks and other safety of the e-bike",
  },
  { id: 11, name: "Price", description: "Price of the e-bike" },
  { id: 12, name: "Maintenance", description: "Maintenance cost in a year" },
  {
    id: 13,
    name: "Social value",
    description: "Social perspective of the e-bike",
  },
  {
    id: 14,
    name: "Re-sell value",
    description: "Re-selling value of the e-bike",
  },
  { id: 15, name: "Overall satisfaction", description: "--" },
];

export default function ProductFeatures({ features: featureData, onChange }) {
  const options = ["1", "2", "3", "4", "5", "6", "7"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto"
    >
      <h2 className="text-xl text-center font-semibold mb-4">
        Product Features and Buying Factors:
      </h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">
              (1-10) Product Feature, (11-15) Buying Factors
            </th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Importance level</th>
            <th className="border p-2">Satisfaction level</th>
            <th className="border p-2">Need fulfillment capacity</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {index + 1}. {feature.name}
              </td>
              <td className="border p-2">{feature.description}</td>
              <td className="border p-2">
                <select
                  className="w-full p-1 border rounded"
                  value={featureData[index]?.importanceLevel || ""}
                  onChange={(e) =>
                    onChange(index, "importanceLevel", e.target.value)
                  }
                >
                  <option>Select</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <select
                  className="w-full p-1 border rounded"
                  value={featureData[index]?.satisfactionLevel || ""}
                  onChange={(e) =>
                    onChange(index, "satisfactionLevel", e.target.value)
                  }
                >
                  <option>Select</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <select
                  className="w-full p-1 border rounded"
                  value={featureData[index]?.fulfillmentCapacity || ""}
                  onChange={(e) =>
                    onChange(index, "fulfillmentCapacity", e.target.value)
                  }
                >
                  <option>Select</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
