import { MapPin, ArrowLeft, Route, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";



export default function StationCard({ station, isNearest , index}) {
  const prices = station.lines?.map((l) => l.price) || [];
  const minPrice = prices.length ? Math.min(...prices) : null;

  return (
    <Link to={`/stations/${station._id}`}>
      <motion.div
      whileInView={{
        x: 0,
        opacity: 1,
      }}
      initial={{
        x: index % 2 === 0 ? 200 : -200,
        opacity: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-mainColor/50 hover:shadow-lg hover:-translate-y-1">
        {isNearest && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-mainColor to-mainColor/60" />
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mainColor/10 text-mainColor">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">
                  {station.stationName}
                </h3>

                {isNearest && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs bg-mainColor/10 text-mainColor px-2 py-1 rounded-full">
                    <Zap className="h-3 w-3" />
                    الأقرب ليك
                  </span>
                )}
              </div>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-mainColor group-hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Route className="h-4 w-4" />
                {station.lines?.length || 0} خطوط
              </span>

              {station.distanceFromUser && (
                <span className="font-medium text-mainColor">
                  {station.distanceFromUser} كم
                </span>
              )}
            </div>

            {minPrice !== null && (
              <div className="text-left">
                <span className="text-xs text-gray-500">يبدأ من</span>
                <p className="font-bold text-mainColor text-lg">
                  {minPrice} ج
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
