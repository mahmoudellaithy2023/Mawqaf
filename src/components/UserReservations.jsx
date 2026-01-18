import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookingHistory } from "../store/slices/Transportation/userBookingSlice";
import ReservationCard from "./ReservationCard";
import { CalendarDays } from "lucide-react";

const UserReservations = () => {
  const dispatch = useDispatch();
  const { history, isLoadingHistory, historyError } = useSelector(
    (state) => state.userBooking
  );

  useEffect(() => {
    dispatch(getUserBookingHistory());
  }, [dispatch]);

  if (isLoadingHistory && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">جاري تحميل سجل الحجوزات...</p>
      </div>
    );
  }

  if (historyError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold">{historyError}</p>
        <button
          onClick={() => dispatch(getUserBookingHistory())}
          className="mt-4 px-6 py-2 bg-mainColor text-white rounded-xl hover:bg-mainColorHover transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
          <CalendarDays size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد سجل للحجوزات</h3>
        <p className="text-gray-500 max-w-xs">
          لم تقم بإجراء أي حجوزات حتى الآن. ابدأ بحجز رحلتك الأولى اليوم!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {history.map((reservation) => (
        <ReservationCard key={reservation._id} reservation={reservation} />
      ))}
    </div>
  );
};

export default UserReservations;
