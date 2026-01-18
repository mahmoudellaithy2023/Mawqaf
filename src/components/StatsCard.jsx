const StatsCard = ({ title, value, icon: Icon, color, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">{title}</h2>
          {loading ? (
            <span className="loading loading-dots loading-md text-gray-400"></span>
          ) : (
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl bg-opacity-10 ${color
            .replace("text", "bg")
            .replace("500", "100")}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
