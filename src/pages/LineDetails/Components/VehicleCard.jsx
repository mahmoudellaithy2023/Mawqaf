import React from "react";
import { Car, User, Snowflake, Users, Clock } from "lucide-react";

const statusConfig = {
  idle: { label: "متاح", color: "text-green-600 bg-green-100" },
  onRoute: { label: "في الطريق", color: "text-yellow-600 bg-yellow-100" },
  maintenance: { label: "صيانة", color: "text-red-600 bg-red-100" },
};

export function VehicleCard({
  vehicle,
  price,
  onBook,
  onCancel,
  onConfirm,
  onShowModal,
  bookingLoading,
  loadingVehicleId,
  hasBooking,
  bookingStatus,
  bookedVehicleId,
}) {
  /* ================= State ================= */
  const [showCancelPrompt, setShowCancelPrompt] = React.useState(false);

  const status = statusConfig[vehicle.currentStatus] || statusConfig.idle;

  const isBookedByUser = bookedVehicleId === vehicle._id;
  const isLoadingThisVehicle = loadingVehicleId === vehicle._id;

  const isDisabled =
    (bookingLoading && !isBookedByUser) ||
    vehicle.currentStatus !== "idle" ||
    (hasBooking && !isBookedByUser) ||
    vehicle.availableSeats === 0;

  const handleClick = () => {
    if (isBookedByUser) {
      if (bookingStatus === "pending") {
        onShowModal();
      } else {
        // active booking cancel
        if (showCancelPrompt) {
          onCancel(vehicle);
          setShowCancelPrompt(false);
        } else {
          setShowCancelPrompt(true);
        }
      }
    } else {
      onBook(vehicle);
    }
  };

  const getButtonText = () => {
    if (isLoadingThisVehicle) return "جاري التنفيذ...";
    if (isBookedByUser && bookingStatus === "pending") return "تأكيد الحجز";
    if (isBookedByUser && bookingStatus === "active") {
      return "نشط";
    }
    if (hasBooking) return "لديك حجز بالفعل";
    if (vehicle.availableSeats === 0) return "لا توجد مقاعد متاحة";

    return "احجز الآن";
  };

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm transition-all
      ${isBookedByUser ? "border-mainColor ring-2 ring-mainColor/40" : ""}`}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-xl">
            <Car className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h4 className="font-bold tetx-blach text-black">{vehicle.model}</h4>
            <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
          </div>
        </div>

        {isBookedByUser ? (
          <span className="px-3 py-1 rounded-full bg-mainColor text-white text-sm">
            محجوزة لك ({bookingStatus === "pending" ? "مؤقت" : "مؤكد"})
          </span>
        ) : (
          <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
            {vehicle.currentStatus === "onRoute" && (
              <Clock className="inline h-3 w-3 ml-1" />
            )}
            {status.label}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 p-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className=" text-gray-500">السائق:</span>
          <strong className="text-black">{vehicle.driverName}</strong>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className=" text-gray-500">السعة:</span>
          <strong className="text-black">{vehicle.capacity}</strong>
        </div>

        <div
          className={`col-span-2 flex items-center gap-2 ${
            vehicle.isAirConditioned ? "text-blue-600" : "text-amber-400"
          }`}
        >
          <Snowflake className="h-4 w-4" />
          {vehicle.isAirConditioned ? "مكيفة" : "غير مكيفة"}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-gray-50">
        <div className="mr-2">
          <p className="text-xs text-gray-500">سعر المقعد</p>
          <p className="text-xl font-bold text-mainColor whitespace-nowrap">
            {price} ج
          </p>
        </div>

        <div className="flex gap-2 w-full justify-end">
          {/* If Pending, Show Both Confirm and Cancel */}
          {isBookedByUser && bookingStatus === "pending" && (
            <button
              onClick={() => onCancel(vehicle)}
              disabled={bookingLoading}
              className="px-3 py-2 rounded-lg text-sm font-medium transition bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
            >
              إلغاء
            </button>
          )}

          <button
            onClick={handleClick}
            disabled={
              isDisabled || (isBookedByUser && bookingStatus === "active")
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none
            ${
              isLoadingThisVehicle
                ? "bg-gray-400 text-white cursor-wait"
                : isBookedByUser
                ? bookingStatus === "pending"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-600 text-white hover:bg-green-700"
                : isDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-mainColor text-white hover:bg-mainColor/90"
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
