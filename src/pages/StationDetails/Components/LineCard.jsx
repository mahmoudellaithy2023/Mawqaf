import { ArrowLeftRight, Car, Banknote, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LineCard({ line, stationId }) {
  const fromName = line.fromStation?.stationName || "محطة البداية";

  const toName = line.toStation?.stationName || "محطة النهاية";

  return (
    <Link to={`/stations/${stationId}/lines/${line._id}`}>
      <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-mainColor/50 hover:shadow-lg hover:-translate-y-1">
        {/* Header */}
        <div
          className="bg-gradient-to-l from-mainColor/5 to-mainColor/10 p-4"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mainColor text-white">
              <ArrowLeftRight className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <span className="truncate">{fromName}</span>
                <ArrowLeft className="h-4 w-4 text-mainColor" />
                <span className="truncate">{toName}</span>
              </div>

              {line.distance && (
                <p className="text-xs text-gray-500 mt-1">
                  المسافة: {line.distance} كم
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-between" dir="rtl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Car className="h-4 w-4" />
            </div>

            <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-muted-foreground">
              متاح الآن
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-mainColor" />
            <span className="font-bold text-lg text-mainColor">
              {line.price} ج
            </span>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-mainColor/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
