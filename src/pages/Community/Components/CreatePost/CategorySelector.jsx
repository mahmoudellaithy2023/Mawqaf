const categories = [
  { key: "DISCUSSION", label: "مناقشة عامة" },
  { key: "CAR_BOOKING", label: "حجز عربيات خاصة" },
  { key: "OPINION", label: "آراء" },
];

const CategorySelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 my-5">
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          onClick={() => onChange(cat.key)}
          className={`px-4 py-1.5 rounded-xl text-sm transition cursor-pointer
            ${
              value === cat.key
                ? "bg-mainColor text-white"
                : "text-gray-400 hover:bg-gray-400 hover:text-white border-2"
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
