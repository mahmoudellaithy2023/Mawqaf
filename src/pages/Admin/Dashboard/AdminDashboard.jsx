import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitCommit, Bus, Users } from "lucide-react";
import { fetchAdminStationDetails, fetchStationStats } from "../../../store/slices/adminSlice";
import StatsCard from "../../../components/StatsCard";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { station, stats, loading, statsLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStationDetails());
  }, [dispatch]);

  useEffect(() => {
    if (station?._id) {
      dispatch(fetchStationStats(station._id));
    }
  }, [dispatch, station?._id]);

  const stationName = station?.stationName || "جاري التحميل...";
  const linesCount = station?.lines?.length || 0;

  const statsList = [
    {
      title: "إجمالي الخطوط",
      value: linesCount,
      icon: GitCommit,
      color: "text-blue-500",
      loading: loading,
    },
    {
      title: "المركبات النشطة",
      value: stats.activeVehicles,
      icon: Bus,
      color: "text-green-500",
      loading: statsLoading,
    },
    {
      title: "رحلات اليوم",
      value: stats.todayTrips,
      icon: GitCommit, // Using GitCommit for trips as well or maybe MapPin? Lucide has Bus, Route, Truck. I'll use Route if available or keep a different color.
      color: "text-orange-500",
      loading: statsLoading,
    },
    {
      title: "ركاب اليوم",
      value: stats.todayPassengers,
      icon: Users,
      color: "text-purple-500",
      loading: statsLoading,
    },
  ];

  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المشرف</h1>
      <p className="text-lg opacity-70 text-gray-600">
        إدارة: <span className="font-bold text-[#0e6b73]">{stationName}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={stat.loading}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">حالة المحطة</h2>
          <p className="text-gray-600">المحطة نشطة وتعمل بشكل طبيعي حالياً.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
