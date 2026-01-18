import React from "react";
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const ReservationCard = ({ reservation }) => {
  const { vehicle, status, price, createdAt, fromStation, toStation } =
    reservation;

  // Use the nested line stations if fromStation/toStation are not directly available
  const startStation =
    fromStation?.stationName ||
    vehicle?.lines[0]?.fromStation?.stationName ||
    "محطة البداية";
  const endStation =
    toStation?.stationName ||
    vehicle?.lines[0]?.toStation?.stationName ||
    "محطة الوصول";
  const model = vehicle?.model || "مركبة";
  const plate = vehicle?.plateNumber || "بدون رقم";

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-600 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      case "pending":
        return "قيد الانتظار";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-white/20 p-5 relative transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-mainColor/10 rounded-xl text-mainColor">
            <Car size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{model}</h3>
            <p className="text-sm text-gray-500 font-medium">{plate}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(
            status
          )}`}
        >
          {getStatusIcon(status)}
          {getStatusLabel(status)}
        </div>
      </div>

      <div className="space-y-4">
        {/* Route Info */}
        <div className="relative">
          <div className="absolute right-[11px] top-6 bottom-6 w-0.5 border-r-2 border-dashed border-gray-200"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-6 h-6 rounded-full bg-mainColor/10 flex items-center justify-center text-mainColor">
              <div className="w-2 h-2 rounded-full bg-mainColor"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">من</span>
              <span className="text-sm font-semibold text-gray-700">
                {startStation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 relative z-10">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">إلى</span>
              <span className="text-sm font-semibold text-gray-700">
                {endStation}
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Calendar size={16} className="text-mainColor" />
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm border-r pr-4 border-gray-100">
              <Clock size={16} className="text-mainColor" />
              <span dir="ltr">{formatTime(createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                السعر
              </p>
              <p className="text-lg font-black text-green-600 leading-none">
                {price} <span className="text-xs font-bold">ج.م</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
