import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Clock } from "lucide-react";

const BookingModal = ({
  bookingData,
  vehicle,
  onConfirm,
  onCancel,
  onClose,
  loading,
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [percentage, setPercentage] = useState(100);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Total booking time is usually 10 minutes (600 seconds)
  const TOTAL_TIME = 10 * 60;

  useEffect(() => {
    if (!bookingData?.expiresAt) return;

    const calculateTime = () => {
      const expiry = new Date(bookingData.expiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));

      setTimeLeft(diff);
      setPercentage((diff / TOTAL_TIME) * 100);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [bookingData, TOTAL_TIME]);

  // Handle Automatic Expiry
  useEffect(() => {
    if (timeLeft === 0 && bookingData && !loading) {
      // Trigger silent cancel (just to clean up frontend state)
      onCancel();
    }
  }, [timeLeft, bookingData, onCancel, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-mainColor p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 hover:bg-white/20 p-1 rounded-full transition"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-full mb-3">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">تأكيد الحجز المعلق</h2>
            <p className="text-sm text-white/80 mt-1">
              يرجى التأكيد قبل انتهاء الوقت
            </p>
          </div>
        </div>

        {/* Countdown & Progress Bar */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-500">
              الوقت المتبقي
            </span>
            <span
              className={`text-2xl font-mono font-bold ${
                timeLeft < 60 ? "text-red-500 animate-pulse" : "text-mainColor"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                percentage > 50
                  ? "bg-green-500"
                  : percentage > 20
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Vehicle Info */}
          <div className="mt-8 space-y-4">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-400 text-sm font-medium">
                  نوع العربة:
                </span>
                <span className="font-bold text-gray-900">
                  {vehicle?.model || "غير متوفر"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-400 text-sm font-medium">
                  رقم اللوحة:
                </span>
                <span className="font-bold text-gray-900">
                  {vehicle?.plateNumber || "غير متوفر"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">
                  اسم السائق:
                </span>
                <span className="font-bold text-gray-900">
                  {vehicle?.driverName || "غير متوفر"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              <p>سيتم إلغاء الحجز تلقائياً عند انتهاء العداد.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row-reverse gap-3 mt-4">
          {!showCancelConfirm ? (
            <>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-mainColor text-white py-3 rounded-xl font-bold hover:bg-mainColor/90 transition shadow-lg shadow-mainColor/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "جاري التأكيد..."
                ) : (
                  <>
                    <CheckCircle size={18} />
                    تأكيد الحجز الآن
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={loading}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
              >
                إلغاء
              </button>
            </>
          ) : (
            <div className="w-full animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-center text-red-600 font-bold mb-3">
                هل أنت متأكد من إلغاء الحجز؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  نعم، إلغاء
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  تراجع
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
