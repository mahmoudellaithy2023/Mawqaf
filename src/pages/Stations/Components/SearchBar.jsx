import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative max-w-2xl mx-auto mb-10 group" dir="rtl">
      {/* Search Input Container */}
      <div className="relative flex items-center transition-all duration-300 transform group-focus-within:scale-[1.02]">
        <div className="absolute right-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#0e6b73] transition-colors" />
        </div>

        <input
          type="text"
          placeholder="ابحث عن اسم الموقف..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border-2 border-gray-100 py-4 pr-12 pl-12 rounded-2xl text-black text-lg shadow-sm font-medium focus:outline-none focus:border-[#0e6b73] focus:ring-4 focus:ring-[#0e6b73]/10 transition-all placeholder:text-gray-400"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute left-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute inset-0 -z-10 bg-[#0e6b73]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
    </div>
  );
}
