import { motion } from "framer-motion";

const LEVEL_OF_IMPORTANTS = [
  {
    id: 7,
    value: "7-(very important)",
  },
  {
    id: 6,
    value: "6-(somewhat important)",
  },
  {
    id: 5,
    value: "5-(important)",
  },
  {
    id: 4,
    value: "4-(Neutral)",
  },
  {
    id: 3,
    value: "3-(unimportant)",
  },
  {
    id: 2,
    value: "2-(somewhat unimportant)",
  },
  {
    id: 1,
    value: "1-(completely unimportant)",
  },
];

const LEVEL_OF_SATISFACTION = [
  {
    id: 7,
    value: "7-(Highly satisfied)",
  },
  {
    id: 6,
    value: "6-(somewhat satisfied)",
  },
  {
    id: 5,
    value: "5-(Satisfied)",
  },
  {
    id: 4,
    value: "4-(Neutral)",
  },
  {
    id: 3,
    value: "3-(dissatisfied)",
  },
  {
    id: 2,
    value: "2-(somewhat dissatisfied)",
  },
  {
    id: 1,
    value: "1-(completely dissatisfied)",
  },
];

export default function ElectricFactors({ formData, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">
        The following factors influence to buy an Electric motorbike:
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level of Importance
          </label>
          <select
            value={formData.electricFactors.importance}
            onChange={(e) =>
              onChange("electricFactors", {
                ...formData.electricFactors,
                importance: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md bg-gray-50"
          >
            <option value="">Select One</option>
            {LEVEL_OF_IMPORTANTS.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level of Satisfaction
          </label>
          <select
            value={formData.electricFactors.satisfaction}
            onChange={(e) =>
              onChange("electricFactors", {
                ...formData.electricFactors,
                satisfaction: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md bg-gray-50"
          >
            <option value="">Select One</option>
            {LEVEL_OF_SATISFACTION.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Need fulfillment capacity by Electric motorbike
          </label>
          <select
            value={formData.electricFactors.fulfillment}
            onChange={(e) =>
              onChange("electricFactors", {
                ...formData.electricFactors,
                fulfillment: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md bg-gray-50"
          >
            <option value="">Select One</option>
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
