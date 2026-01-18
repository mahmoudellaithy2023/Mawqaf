import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Users, MapPin, Truck } from "lucide-react";
import API from "../../../API/axios";
import useAdminStation from "../../../hooks/useAdminStation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const AdminVehicleTrips = () => {
  const { vehicleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { station, loading: stationLoading } = useAdminStation();
  const [tripsData, setTripsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // lineId should be passed via state effectively, but if missing (direct link),
  // we might have issues as backend route structure requires it.
  // We'll try to use the one passed or handle error.
  const lineId = location.state?.lineId;

  useEffect(() => {
    const fetchTrips = async () => {
      if (!station?._id || !lineId) return;

      try {
        setLoading(true);
        // The backend route is nested: /station/:stationId/lines/:lineId/vichels/:vichelId/trips
        const res = await API.get(
          `/station/${station._id}/lines/${lineId}/vichels/${vehicleId}/trips`
        );
        setTripsData(res.data.data || []);
      } catch (error) {
        console.error("Fetch trips error", error);
      } finally {
        setLoading(false);
      }
    };

    if (station && lineId) {
      fetchTrips();
    } else if (station && !lineId) {
      // Fallback or error if lineId is missing
      setLoading(false);
    }
  }, [station, vehicleId, lineId]);

  if (stationLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-[#0e6b73]"></span>
      </div>
    );

  if (!lineId)
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">خطأ: لم يتم تحديد خط السير.</p>
        <button onClick={() => navigate(-1)} className="btn btn-sm">
          عودة
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-circle btn-ghost btn-sm text-gray-500 hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="text-[#0e6b73]" />
            سجل رحلات المركبة
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            عرض تاريخ الرحلات والركاب للمركبة
          </p>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-10">
            <span className="loading loading-spinner text-[#0e6b73]"></span>
          </div>
        ) : tripsData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl border border-gray-100 text-gray-400">
            لا توجد رحلات سابقة لهذه المركبة
          </div>
        ) : (
          tripsData.map((dayGroup) => (
            <div
              key={dayGroup._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <Calendar size={18} className="text-[#0e6b73]" />
                  {format(new Date(dayGroup._id), "EEEE, d MMMM yyyy", {
                    locale: ar,
                  })}
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {dayGroup.tripCount} رحلات
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} /> {dayGroup.totalPassengers} راكب
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {dayGroup.trips.map((trip, index) => (
                  <div
                    key={trip._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="badge bg-[#0e6b73]/10 text-[#0e6b73] border-0 pt-0.5">
                          رحلة #{dayGroup.tripCount - index}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {format(new Date(trip.date), "hh:mm a", {
                            locale: ar,
                          })}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {trip.passengerCount} راكب
                      </span>
                    </div>

                    {/* Passengers Avatars/List - Preview */}
                    {trip.bookings && trip.bookings.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trip.bookings.map((booking) => (
                          <div
                            key={booking._id}
                            className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                              {booking.user?.firstName?.[0] || "?"}
                            </div>
                            <span className="text-xs text-gray-600">
                              {booking.user?.firstName} {booking.user?.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminVehicleTrips;
