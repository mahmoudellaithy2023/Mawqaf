import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStations,
  fetchAdminUsers,
} from "../../../store/slices/managerSlice";
import {
  Plus,
  UserPlus,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import API from "../../../API/axios";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

const ManagerStations = () => {
  const dispatch = useDispatch();

  // Redux State
  const {
    stations: stationsState,
    adminUsers,
    loadingAdmins,
  } = useSelector((state) => state.manager);
  const { data: stations, loading, totalPages, currentPage } = stationsState;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10); // Managed locally for now, could be in Redux

  // Form States
  const [newStation, setNewStation] = useState({
    stationName: "",
    lat: "",
    lng: "",
  });
  const [adminId, setAdminId] = useState("");

  const loadStations = (page = 1, search = "") => {
    dispatch(fetchStations({ page, limit, search }));
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      loadStations(1, query);
    }, 500),
    []
  );

  useEffect(() => {
    loadStations(1, "");
    return () => debouncedSearch.cancel();
  }, [dispatch]);

  useEffect(() => {
    if (isAdminModalOpen && adminUsers.length === 0) {
      dispatch(fetchAdminUsers());
    }
  }, [isAdminModalOpen, dispatch, adminUsers.length]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      const payload = [
        {
          stationName: newStation.stationName,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(newStation.lng),
              parseFloat(newStation.lat),
            ],
          },
          status: "active",
        },
      ];

      await API.post("/station", payload);
      toast.success("تم إضافة المحطة بنجاح");
      setIsAddModalOpen(false);
      setNewStation({ stationName: "", lat: "", lng: "" });
      loadStations(currentPage, searchTerm);
    } catch (error) {
      console.error(error);
      toast.error("فشل في إضافة المحطة");
    }
  };

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/station/${selectedStationId}/admin`, { adminId });
      toast.success("تم تعيين المسؤول بنجاح");
      setIsAdminModalOpen(false);
      setAdminId("");
      loadStations(currentPage, searchTerm);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "فشل في تعيين المسؤول");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadStations(newPage, searchTerm);
    }
  };

  if (loading && stations.length === 0)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المحطات</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث عن محطة..."
              className="input input-bordered w-full rounded-xl pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#0e6b73] focus:ring-1 focus:ring-[#0e6b73]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0e6b73] text-white rounded-xl hover:bg-[#146f7b] transition shadow-md whitespace-nowrap"
          >
            <Plus size={20} /> إضافة محطة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="table">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100 text-right">
              <th>الاسم</th>
              <th>الموقع</th>
              <th>حالة المسؤول</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {stations.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  لا توجد محطات تماثل بحثك
                </td>
              </tr>
            ) : (
              stations.map((station) => (
                <tr
                  key={station._id}
                  className="hover:bg-gray-50 border-b border-gray-100 last:border-0 hover"
                >
                  <td className="font-medium text-gray-800 text-right">
                    {station.stationName}
                  </td>
                  <td className="text-gray-600  text-right">
                    <div className="flex items-center justify-start gap-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {station.location?.coordinates?.[1].toFixed(4)},{" "}
                        {station.location?.coordinates?.[0].toFixed(4)}
                      </span>
                      <MapPin size={14} />
                    </div>
                  </td>
                  <td className="text-right">
                    {station.admin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        معين
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        غير معين
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedStationId(station._id);
                        setIsAdminModalOpen(true);
                      }}
                      className="btn btn-xs btn-ghost text-[#0e6b73] border hover:border-[#0e6b73] hover:rounded-2xl  hover:bg-[#b8d4d7]/30 ml-2 gap-1"
                    >
                      <UserPlus size={14} /> تعيين مسؤول
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-circle btn-ghost disabled:bg-transparent text-[#0e6b73]"
          >
            <ChevronRight size={20} />
          </button>
          <span className="text-gray-600 font-medium">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-circle btn-ghost disabled:bg-transparent text-[#0e6b73]"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}

      {/* Add Station Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                إضافة محطة جديدة
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle text-mainColor hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStation} className="space-y-4">
              <div>
                <label className="label text-sm font-medium text-gray-700">
                  اسم المحطة
                </label>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full rounded-xl bg-white border-gray-300 text-gray-800 focus:border-[#0e6b73] focus:outline-none focus:ring-1 focus:ring-[#0e6b73]"
                  value={newStation.stationName}
                  onChange={(e) =>
                    setNewStation({
                      ...newStation,
                      stationName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-gray-700">
                    خط العرض (Lat)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="input input-bordered w-full rounded-xl bg-white border-gray-300 text-gray-800 focus:border-[#0e6b73] focus:outline-none focus:ring-1 focus:ring-[#0e6b73]"
                    value={newStation.lat}
                    onChange={(e) =>
                      setNewStation({ ...newStation, lat: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label text-sm font-medium text-gray-700">
                    خط الطول (Lng)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="input input-bordered w-full rounded-xl bg-white border-gray-300 text-gray-800 focus:border-[#0e6b73] focus:outline-none focus:ring-1 focus:ring-[#0e6b73]"
                    value={newStation.lng}
                    onChange={(e) =>
                      setNewStation({ ...newStation, lng: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn w-full bg-[#0e6b73] hover:bg-[#146f7b] text-white border-0 rounded-xl"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                تعيين مسؤول للمحطة
              </h2>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle text-mainColor hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignAdmin} className="space-y-4">
              <div>
                <label className="label text-sm font-medium text-gray-700">
                  اختر المسؤول
                </label>
                {loadingAdmins ? (
                  <div className="flex justify-center p-2">
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  <select
                    className="select select-bordered w-full rounded-xl bg-white border-gray-300 text-gray-800 focus:border-[#0e6b73] focus:outline-none focus:ring-1 focus:ring-[#0e6b73]"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                  >
                    <option value="" disabled className="text-gray-400">
                      اختر من القائمة...
                    </option>
                    {adminUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
                <label className="label text-xs text-gray-500">
                  يتم عرض المستخدمين بصلاحية Admin فقط.
                </label>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn w-full bg-[#0e6b73] hover:bg-[#146f7b] text-white border-0 rounded-xl"
                >
                  تعيين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStations;
