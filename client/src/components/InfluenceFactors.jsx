const InfluenceFactors = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Factors Influencing Electric Motorbike Purchase
      </h2>

      <div className="flex flex-col gap-4  text-center">
        <div className="bg-gray-50  p-4 rounded-lg shadow-md border border-gray-300 ">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Level of Importance
          </h3>
          <p className="text-gray-600">
            7 = Very important, 6 = Somewhat important, 5 = Important, 4 =
            Neutral, 3 = Unimportant, 2 = Somewhat unimportant, 1 = Completely
            unimportant
          </p>
        </div>

        <div className="bg-gray-50  p-4 rounded-lg shadow-md border border-gray-300 ">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Satisfaction Level
          </h3>
          <div className="text-gray-600">
            7 = Highly satisfied 6 = Somewhat satisfied 5 = Satisfied 4 =
            Neutral 3 = Dissatisfied 2 = Somewhat dissatisfied 1 = Completely
            dissatisfied
          </div>
        </div>

        <div className="bg-gray-50  p-4 rounded-lg shadow-md border border-gray-300 ">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Need Fulfillment Capacity
          </h3>
          <p className="text-gray-600">
            Rated on a continuous scale from 1 to 7
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfluenceFactors;
