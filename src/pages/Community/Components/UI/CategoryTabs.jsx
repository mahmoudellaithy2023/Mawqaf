const tabs = [
  { key: "ALL", label: "الكل" },
  { key: "DISCUSSION", label: "مناقشة عامة" },
  { key: "CAR_BOOKING", label: "حجز عربيات خاصة" },
  { key: "OPINION", label: "آراء" },
];

const CategoryTabs = ({ active, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
                        ${
                          active === tab.key
                            ? "bg-mainColor text-white shadow-lg shadow-mainColor/30 translate-y-[-2px]"
                            : "bg-white text-gray-500 hover:bg-gray-50 hover:text-mainColor border border-transparent hover:border-mainColor/10 shadow-sm"
                        }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
