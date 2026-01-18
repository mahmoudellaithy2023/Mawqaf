import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { MapPin, Route, AlertCircle, ArrowLeft } from "lucide-react";

import LineCard from "./Components/LineCard";
import { fetchStationById, clearStation } from "../../store/slices/Transportation/stationDetailsSlice";
import LineCardSkeleton from "../../components/Skeltons/LineCardSkeleton";

export default function StationDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { station, loading, error } = useSelector(
    (state) => state.stationDetails
  );

  useEffect(() => {
    dispatch(fetchStationById(id));

    return () => {
      dispatch(clearStation());
    };
  }, [dispatch, id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">حدث خطأ: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-bl from-mainColor to-mainColor/80 text-white py-25 px-4">
        <div
          className="max-w-6xl mx-auto flex justify-between items-center pt-10"
          dir="rtl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <MapPin className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {loading ? "..." : station?.stationName}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  <Route className="inline w-3 h-3 ml-1" />
                  {loading ? "..." : station?.lines?.length || 0} خطوط
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/stations"
            className="flex items-center gap-1 text-white mb-4 group"
          >
            العودة للمواقف
            <ArrowLeft className="inline w-5 mt-1 h-5 ml-1 group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Lines */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        

         <h2 className="text-2xl font-semibold my-6 flex items-center gap-2 text-black">
                  <Route className="h-5 w-5" />
          الخطوط المتاحة
                </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <LineCardSkeleton key={i} />
              ))
            : station?.lines && station.lines.length > 0
            ? station.lines.map((line, index) => (
                <div
                  key={line._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <LineCard line={line} stationId={station._id} />
                </div>
              ))
            : (
                <div className="col-span-full bg-white rounded-xl p-12 text-center">
                  <Route className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد خطوط متاحة حالياً</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
