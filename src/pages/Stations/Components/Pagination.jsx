import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className="flex items-center justify-center gap-2 mt-12 py-4"
      dir="rtl"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-[#0e6b73] hover:text-white hover:border-[#0e6b73] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPages()[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#0e6b73] transition-all"
            >
              1
            </button>
            {getPages()[0] > 2 && (
              <span className="text-gray-400 px-1">...</span>
            )}
          </>
        )}

        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
              currentPage === page
                ? "bg-[#0e6b73] text-white shadow-lg shadow-[#0e6b73]/20 scale-110"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#0e6b73]"
            }`}
          >
            {page}
          </button>
        ))}

        {getPages()[getPages().length - 1] < totalPages && (
          <>
            {getPages()[getPages().length - 1] < totalPages - 1 && (
              <span className="text-gray-400 px-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#0e6b73] transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-[#0e6b73] hover:text-white hover:border-[#0e6b73] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}
