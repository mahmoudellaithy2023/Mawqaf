import { LayoutGrid, MessageSquare, Car, MessageCircle } from "lucide-react";

const categories = [
  { key: "ALL", label: "الكل", icon: LayoutGrid },
  { key: "DISCUSSION", label: "مناقشة عامة", icon: MessageSquare },
  { key: "CAR_BOOKING", label: "حجز عربيات خاصة", icon: Car },
  { key: "OPINION", label: "آراء", icon: MessageCircle },
];

const SidebarNav = ({ activeCategory, onCategoryChange }) => {
  return (
    <ul className="space-y-1">
      {categories.map((item) => {
        const Icon = item.icon;
        const isActive = activeCategory === item.key;

        return (
          <li
            key={item.key}
            onClick={() => onCategoryChange(item.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "bg-mainColor text-white shadow-md shadow-mainColor/20 translate-x-1"
                  : "text-gray-500 hover:bg-gray-50 hover:text-mainColor"
              }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive
                  ? "text-white"
                  : "text-gray-400 group-hover:text-mainColor"
              }`}
            />
            <span
              className={`text-sm font-medium ${isActive ? "font-bold" : ""}`}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNav;
