import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { fetchManagerStats } from "../../../store/slices/managerSlice";
import StatsCard from "../../../components/StatsCard";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.manager);

  useEffect(() => {
    dispatch(fetchManagerStats());
  }, [dispatch]);

  const statCards = [
    {
      title: "إجمالي المستخدمين",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "المحطات النشطة",
      value: stats?.activeStations || 0,
      icon: MapPin,
      color: "text-green-500",
    },
    {
      title: "إجمالي المنشورات",
      value: stats?.totalPosts || 0,
      icon: MessageSquare,
      color: "text-purple-500",
    },
    {
      title: "البلاغات المعلقة",
      value: stats?.pendingReports || 0,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center p-10 text-red-500">
        فشل في تحميل البيانات: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المدير</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="text-[#0e6b73]" />
            النشاط الأخير
          </h2>
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">موجز النشاط قادم قريباً...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
