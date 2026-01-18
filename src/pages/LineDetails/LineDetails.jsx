import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Car, MapPin, Route } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchLineById,
  clearLine,
} from "../../store/slices/Transportation/linesSlice";
import { fetchLineVichels } from "../../store/slices/Transportation/vichelsSlice";

import {
  bookSeat,
  cancelBooking,
  confirmBooking,
  clearBookingMessages,
  syncBooking,
} from "../../store/slices/Transportation/userBookingSlice";

import LineSummary from "./Components/LineSummary";
import { VehicleCard } from "./Components/VehicleCard";
import { VehicleCardSkeleton } from "./Components/VehicleCardSkeleton";
import BookingModal from "./Components/BookingModal";
import Swal from "sweetalert2";
import API from "../../API/axios";
import ErrorPage from "../ErrorPage";

export default function LineDetails() {
  const { stationId, lineId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= State ================= */
  const [showModal, setShowModal] = React.useState(false);
  const [hasSynced, setHasSynced] = React.useState(false);

  const { line, loading, error } = useSelector((state) => state.lines);
  const { user } = useSelector((state) => state.auth);
  const {
    results: vichels,
    count,
    loading: vichelsLoading,
  } = useSelector((state) => state.vichels);

  const {
    loading: bookingLoading,
    loadingVehicleId,
    hasBooking,
    bookingStatus,
    bookedVehicleId,
    bookingData,
    error: bookingError,
    successMessage,
  } = useSelector((state) => state.userBooking);

  /* ================= Derived Data ================= */
  const bookedVehicle = vichels.find((v) => v._id === bookedVehicleId);

  /* ================= Synchronization Logic ================= */
  useEffect(() => {
    if (!hasSynced && vichels.length > 0 && user?.id) {
      if (!hasBooking) {
        // Check if user is already booked in any of the vehicles
        const vehicleWithUser = vichels.find((v) =>
          v.bookedUsers?.some((u) => u._id === user.id || u.id === user.id)
        );

        if (vehicleWithUser) {
          dispatch(syncBooking({ vehicle: vehicleWithUser, userId: user.id }));

          // Also automatically show modal if the status is pending
          const userBooking = vehicleWithUser.bookedUsers.find(
            (u) => u._id === user.id || u.id === user.id
          );
          if (userBooking?.bookingStatus === "pending") {
            setShowModal(true);
          }
        }
      }
      setHasSynced(true);
    }
  }, [hasBooking, vichels, user, dispatch, hasSynced]);

  /* ================= Fetch Data ================= */
  useEffect(() => {
    dispatch(fetchLineById({ stationId, lineId }));
    dispatch(fetchLineVichels({ stationId, lineId }));

    return () => {
      dispatch(clearLine());
    };
  }, [dispatch, stationId, lineId]);

  /* ================= Toast Handling ================= */
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      // If it was a successful "Book Now" (pending state started)
      if (successMessage.includes("حجز المقعد مؤقتًا")) {
        setShowModal(true);
      }

      // Re-fetch vehicles to sync the backend data for all cards
      dispatch(fetchLineVichels({ stationId, lineId }));

      dispatch(clearBookingMessages());
    }

    if (bookingError) {
      toast.error(bookingError);
      dispatch(clearBookingMessages());
    }
  }, [successMessage, bookingError, dispatch]);

  /* ================= Handlers ================= */
  const handleBook = (vehicle) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        text: "You should be logged in to do this action",
        confirmButtonText: "OK",
      });
      navigate("/auth/login");
      return;
    }

    dispatch(
      bookSeat({
        stationId,
        lineId,
        vichelId: vehicle._id,
      })
    );
  };

  const handleCancel = (vehicle) => {
    dispatch(
      cancelBooking({
        stationId,
        lineId,
        vichelId: vehicle ? vehicle._id : bookedVehicleId,
      })
    );
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      // Create Stripe Checkout session directly
      // The status will be updated to "active" by the webhook/success page logic
      const payload = { bookingId: bookingData._id };
      const { data } = await API.post("/payment/checkout-session", payload);

      if (data.session_url) {
        window.location.href = data.session_url;
      } else {
        toast.error("فشل في إنشاء جلسة الدفع");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء التأكيد"
      );
    }
  };

  /* ================= UI States ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mainColor font-bold text-lg">
          جاري تحميل تفاصيل الخط...
        </p>
      </div>
    );
  }

  if (error) return <ErrorPage/>

  if (!line) {
    return (
      <p className="text-gray-500 text-center mt-10  ">
        لا توجد بيانات لهذا الخط
      </p>
    );
  }

  const availableVehicles = vichels.filter(
    (v) => v.currentStatus === "idle"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= Header ================= */}
      <div className="bg-gradient-to-bl from-mainColor to-mainColor/80 text-white py-25 px-4 ">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <MapPin className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                خط {line.fromStation.stationName.replace("موقف ", "")}
                <span className="mx-2"> - </span>
                {line.toStation.stationName.replace("موقف ", "")}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  <Car className="inline w-4 h-4 ml-1" />
                  {count}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/stations/${stationId}`}
            className="flex items-center gap-1 text-white group"
          >
            العودة للموقف
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="p-6 max-w-6xl mx-auto">
        <LineSummary
          line={line}
          totalVehicles={count}
          availableVehicles={availableVehicles}
        />

        <h2 className="text-2xl font-semibold my-6 flex items-center gap-2 text-black">
          <Car className="h-5 w-5" />
          العربيات المتاحة
        </h2>

        {vichelsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : vichels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vichels.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                price={line.price}
                onBook={handleBook}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                onShowModal={() => setShowModal(true)}
                bookingLoading={bookingLoading}
                loadingVehicleId={loadingVehicleId}
                hasBooking={hasBooking}
                bookingStatus={bookingStatus}
                bookedVehicleId={bookedVehicleId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">لا توجد عربيات متاحة لهذا الخط</p>
        )}
      </div>

      {/* ================= Booking Modal ================= */}
      {hasBooking && bookingStatus === "pending" && showModal && (
        <BookingModal
          bookingData={bookingData}
          vehicle={bookedVehicle || bookingData?.vehicle}
          onConfirm={handleConfirm}
          onCancel={() => handleCancel(null)}
          onClose={() => setShowModal(false)}
          loading={bookingLoading}
        />
      )}
    </div>
  );
}
