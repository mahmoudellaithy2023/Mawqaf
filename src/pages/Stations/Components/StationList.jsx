import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, SearchX, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

import StationCard from "./StationCard";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { fetchStations } from "../../../store/slices/Transportation/stationsSlice";
import StationCardSkeleton from "../../../components/Skeltons/StationCardSkeleton";

export default function StationsList() {
  const dispatch = useDispatch();
  const { stations, loading, error } = useSelector((state) => state.stations);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  // Client-side filtering
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations;

    const query = searchQuery.toLowerCase().trim();
    return stations.filter((station) =>
      station.stationName.toLowerCase().includes(query)
    );
  }, [stations, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStations = filteredStations.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            عذراً، حدث خطأ
          </h2>
          <p className="text-gray-500 mb-6">
            فشلنا في تحميل بيانات المواقف. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <button
            onClick={() => dispatch(fetchStations())}
            className="btn bg-[#0e6b73] text-white hover:bg-[#094f56] px-8 rounded-xl border-none h-12"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Enhanced Hero Section */}
      <div className="relative bg-[#0e6b73] text-white py-24 px-4 overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#f59f0a]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md mb-8 shadow-2xl border border-white/20"
          >
            <MapPin className="h-10 w-10 text-[#f59f0a]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black mb-6 tracking-tight"
          >
            استكشف المواقف
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            ابحث عن الموقف الأقرب إليك، تتبع الخطوط، واحجز رحلتك القادمة بكل
            سهولة وذكاء.
          </motion.p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-[#0e6b73] rounded-full"></div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {searchQuery ? "نتائج البحث" : "جميع المواقف المتاحة"}
              </h3>
              <p className="text-sm text-gray-500">
                تم العثور على{" "}
                <span className="text-[#0e6b73] font-bold">
                  {filteredStations.length}
                </span>{" "}
                موقف
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <MousePointer2 size={14} className="text-[#f59f0a]" />
            <span>اختر موقفاً لاستعراض التفاصيل</span>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <StationCardSkeleton key={i} />
            ))
          ) : currentStations.length > 0 ? (
            currentStations.map((station, index) => (
              <StationCard
                key={station._id}
                station={station}
                index={index}
                isNearest={false}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                لم نجد أي موقف يطابق بحثك عن "{searchQuery}". جرب كلمات بحث
                أخرى.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 text-[#0e6b73] font-bold hover:underline underline-offset-4"
              >
                مسح البحث وعرض القائمة الكاملة
              </button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {!loading && filteredStations.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
