import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Check,
  X,
  MapPin,
  Truck,
  User,
  Hash,
  Wind,
  Activity,
  Search,
  Filter,
  RefreshCcw,
  History,
} from "lucide-react";
import API from "../../../API/axios";
import { toast } from "react-hot-toast";
import useAdminStation from "../../../hooks/useAdminStation";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminVehicles = () => {
  const { station, loading: stationLoading } = useAdminStation();
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Line Selection Dropdown States
  const [isLineDropdownOpen, setIsLineDropdownOpen] = useState(false);
  const [lineSearchQuery, setLineSearchQuery] = useState("");
  const lineDropdownRef = useRef(null);

  // Vehicle Search State
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [originalPlateNumber, setOriginalPlateNumber] = useState("");
  const [formData, setFormData] = useState({
    plateNumber: "",
    driverName: "",
    model: "",
    capacity: "",
    isAirConditioned: false,
    currentStatus: "idle",
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch Lines
  useEffect(() => {
    const fetchLines = async () => {
      if (!station?._id) return;
      try {
        const res = await API.get(`/station/${station._id}/lines`);
        const linesData = res.data.results || [];
        setLines(linesData);
        
        // ✨ Set default line if none selected
        if (linesData.length > 0 && !selectedLineId) {
          setSelectedLineId(linesData[0]._id);
        }
      } catch (error) {
        console.error("Fetch lines error", error);
        toast.error("فشل في تحميل الخطوط");
      }
    };
    if (station) fetchLines();
  }, [station]);

  // Fetch Vehicles when Line is selected
  const fetchVehicles = async () => {
    if (!selectedLineId || !station?._id) return;
    setLoading(true);
    try {
      const res = await API.get(
        `/station/${station._id}/lines/${selectedLineId}/vichels/admin`
      );
      setVehicles(res.data.results || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("فشل في تحميل المركبات");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLineId) {
      fetchVehicles();
    } else {
      setVehicles([]);
    }
  }, [selectedLineId]);

  // Handle Click Outside Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lineDropdownRef.current &&
        !lineDropdownRef.current.contains(event.target)
      ) {
        setIsLineDropdownOpen(false);
      }
    };
    if (isLineDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLineDropdownOpen]);

  // Handle Reset Trip (Complete Trip & Reset Bookings)
  const handleResetTrip = async (vehicleId, plateNumber) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم إنهاء الرحلة الحالية للمركبة ${plateNumber} وإعادة تعيين الحجوزات.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e6b73",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، إنهاء الرحلة",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-6",
        cancelButton: "rounded-xl px-6",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const line = lines.find((l) => l._id === selectedLineId);
          const destinationName =
            line?.toStation?.stationName || "المحطة الأخرى";

          await API.post(
            `/station/${station._id}/lines/${selectedLineId}/vichels/${vehicleId}/reset`
          );

          toast.success(
            `تم تسجيل الرحلة وانتقلت المركبة إلى ${destinationName}`
          );
          fetchVehicles(); // Refresh list (vehicle will likely disappear as it moved)
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.message || "فشل في عملية إعادة التعيين"
          );
        }
      }
    });
  };

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditMode(true);
      setSelectedVehicleId(vehicle._id);
      const plate = vehicle.plateNumber || vehicle.plate || "";
      setOriginalPlateNumber(plate);
      setFormData({
        plateNumber: plate,
        driverName: vehicle.driverName || "",
        model: vehicle.model || "",
        capacity: vehicle.capacity || "",
        isAirConditioned: vehicle.isAirConditioned || false,
        currentStatus: vehicle.currentStatus || "idle",
      });
    } else {
      setEditMode(false);
      setOriginalPlateNumber("");
      setFormData({
        plateNumber: "",
        driverName: "",
        model: "",
        capacity: "",
        isAirConditioned: false,
        currentStatus: "idle",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      if (editMode) {
        await API.put(
          `/station/${station._id}/lines/${selectedLineId}/vichels/${selectedVehicleId}`,
          payload,
          {
            params: { plateNumber: originalPlateNumber },
          }
        );
        toast.success("تم تحديث المركبة بنجاح");
      } else {
        await API.post(
          `/station/${station._id}/lines/${selectedLineId}/vichels`,
          payload
        );
        toast.success("تم إضافة المركبة بنجاح");
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "فشل في حفظ البيانات");
    }
  };

  const handleDelete = async (id, plateNumber) => {
    try {
      await API.delete(
        `/station/${station._id}/lines/${selectedLineId}/vichels/${id}?plateNumber=${plateNumber}`
      );
      toast.success("تم حذف المركبة بنجاح");
      fetchVehicles();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error(error);
      toast.error("فشل في حذف المركبة");
    }
  };

  // Filter lines based on search
  const filteredLines = lines.filter((line) => {
    const lineName = `${line.fromStation?.stationName || "?"} ➝ ${
      line.toStation?.stationName || "?"
    }`;
    return lineName.toLowerCase().includes(lineSearchQuery.toLowerCase());
  });

  const getLineName = (id) => {
    const line = lines.find((l) => l._id === id);
    if (!line) return "";
    return `${line.fromStation?.stationName || "?"} ➝ ${
      line.toStation?.stationName || "?"
    }`;
  };

  // Filter Vehicles Logic
  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = vehicleSearchQuery.toLowerCase();
    const plate = (vehicle.plateNumber || vehicle.plate || "").toLowerCase();
    const driver = (vehicle.driverName || "").toLowerCase();
    return plate.includes(query) || driver.includes(query);
  });

  if (stationLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  if (!station)
    return <div className="text-center p-10">لا توجد محطة معينة</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto z-20">
          <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            إدارة المركبات
          </h1>

          {/* Searchable Line Dropdown */}
          <div className="relative w-full md:w-80" ref={lineDropdownRef}>
            <div
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all cursor-pointer"
              onClick={() => setIsLineDropdownOpen(!isLineDropdownOpen)}
            >
              <MapPin size={18} className="text-[#0e6b73]" />
              <input
                type="text"
                placeholder="اختر خط الرحلة..."
                className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder:text-gray-400 cursor-pointer"
                value={
                  selectedLineId ? getLineName(selectedLineId) : lineSearchQuery
                }
                onChange={(e) => {
                  setLineSearchQuery(e.target.value);
                  setSelectedLineId(""); // Clear selection on type
                  setIsLineDropdownOpen(true);
                }}
                onFocus={() => {
                  setLineSearchQuery("");
                  setIsLineDropdownOpen(true);
                }}
              />
              {selectedLineId && <Check size={16} className="text-[#0e6b73]" />}
            </div>

            {isLineDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                {filteredLines.length > 0 ? (
                  filteredLines.map((line) => (
                    <div
                      key={line._id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition border-b border-gray-50 last:border-0"
                      onClick={() => {
                        setSelectedLineId(line._id);
                        setIsLineDropdownOpen(false);
                        setLineSearchQuery("");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                          {line.distance} km
                        </span>
                        <span className="text-gray-700 text-sm font-medium">
                          {line.fromStation?.stationName} ➝{" "}
                          {line.toStation?.stationName}
                        </span>
                      </div>
                      {selectedLineId === line._id && (
                        <Check size={16} className="text-[#0e6b73]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-center text-sm">
                    لا توجد خطوط مطابقة
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          disabled={!selectedLineId}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0e6b73] text-white rounded-xl hover:bg-[#146f7b] transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed w-full md:w-auto justify-center font-medium"
        >
          <Plus size={20} /> إضافة مركبة
        </button>
      </div>

      <div className="overflow-visible bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        {/* Vehicle Search Input - Added functionality */}
        {selectedLineId && (
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="بحث برقم اللوحة أو اسم السائق..."
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#0e6b73] focus:border-[#0e6b73] block w-full pr-10 pl-2.5 py-2.5 outline-none transition-all"
                value={vehicleSearchQuery}
                onChange={(e) => setVehicleSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500 font-medium">
              العدد: {filteredVehicles.length}
            </div>
          </div>
        )}

        {!selectedLineId ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <Truck size={64} className="mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">
              يرجى اختيار خط رحلة لعرض وإدارة المركبات
            </p>
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100 text-right text-sm">
                <th className="py-4 pr-6">رقم اللوحة</th>
                <th>السائق</th>
                <th>الموديل</th>
                <th>المحطة الحالية</th>
                <th>المواصفات</th>
                <th>الحالة</th>
                <th>الإشغال</th>
                <th className="pl-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <span className="loading loading-spinner text-[#0e6b73] loading-lg"></span>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-gray-400 flex flex-col items-center gap-2"
                  >
                    <Filter size={32} className="opacity-20" />
                    <span>لا توجد مركبات مطابقة للبحث</span>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className="hover:bg-gray-50/60 border-b border-gray-100 last:border-0 transition-colors group"
                  >
                    <td className="py-4 pr-6 font-bold text-gray-800 text-right font-mono tracking-wider">
                      <div className="bg-gray-100 px-2 py-1 rounded inline-block border border-gray-200">
                        {vehicle.plateNumber || vehicle.plate}
                      </div>
                    </td>
                    <td className="text-gray-700 text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User size={14} />
                        </div>
                        {vehicle.driverName}
                      </div>
                    </td>
                    <td className="text-gray-600 text-right">
                      {vehicle.model}
                    </td>
                    <td className="text-gray-600 text-right">
                      <div className="flex items-center gap-1.5 text-[#0e6b73] font-medium">
                        <MapPin size={14} />
                        {vehicle.currentStation?.stationName || "غير محدد"}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 flex-wrap">
                        <span className="badge badge-sm bg-gray-50 text-gray-600 border border-gray-200 p-3">
                          {vehicle.capacity} راكب
                        </span>
                        {vehicle.isAirConditioned && (
                          <span className="badge badge-sm bg-blue-50 text-blue-600 border-blue-100 p-3 gap-1">
                            <Wind size={12} /> مكيف
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          vehicle.currentStatus === "onRoute"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : vehicle.currentStatus === "maintenance"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vehicle.currentStatus === "onRoute"
                              ? "bg-blue-600"
                              : vehicle.currentStatus === "maintenance"
                              ? "bg-amber-600"
                              : "bg-emerald-600"
                          }`}
                        ></span>
                        {vehicle.currentStatus === "onRoute"
                          ? "في الطريق"
                          : vehicle.currentStatus === "maintenance"
                          ? "صيانة"
                          : "متاح"}
                      </span>
                    </td>
                    <td className="w-48 px-4">
                      {(() => {
                        const occupied =
                          vehicle.capacity -
                          (vehicle.availableSeats ?? vehicle.capacity);
                        const percentage = Math.round(
                          (occupied / vehicle.capacity) * 100
                        );
                        let colorDate = "";
                        if (percentage < 50) colorDate = "#10b981"; // Emerald
                        else if (percentage < 80)
                          colorDate = "#f59e0b"; // Amber
                        else colorDate = "#ef4444"; // Red

                        return (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                              <span>
                                {occupied} / {vehicle.capacity}
                              </span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: colorDate,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="text-center pl-6">
                      <div className="flex items-center justify-center gap-2 transition-opacity">
                        {/* Trips Icon */}
                        <button
                          onClick={() =>
                            navigate(`/admin/vehicles/${vehicle._id}/trips`, {
                              state: { lineId: selectedLineId },
                            })
                          }
                          className="btn btn-sm btn-square btn-ghost text-blue-500 hover:bg-blue-50"
                          title="سجل الرحلات"
                        >
                          <History size={16} />
                        </button>

                        {/* Reset Icon - Only shows if vehicle is NOT at this admin's station */}
                        {(vehicle.currentStation?._id || vehicle.currentStation) !==
                          station?._id && (
                          <button
                            onClick={() =>
                              handleResetTrip(vehicle._id, vehicle.plateNumber)
                            }
                            className="btn btn-sm btn-square btn-ghost text-orange-500 hover:bg-orange-50"
                            title="تأكيد الوصول وإعادة التعيين"
                          >
                            <RefreshCcw size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenModal(vehicle)}
                          className="btn btn-sm btn-square btn-ghost text-[#0e6b73] hover:bg-[#0e6b73]/10"
                          title="تعديل"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>

                        {/* Modern Toggle Delete Button */}
                        {deleteConfirmId === vehicle._id ? (
                          <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                            <button
                              onClick={() =>
                                handleDelete(vehicle._id, vehicle.plateNumber)
                              }
                              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="btn btn-sm btn-ghost text-gray-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(vehicle._id)}
                            className="btn btn-sm btn-square btn-ghost text-red-400 hover:text-red-500 hover:bg-red-50"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? "تعديل بيانات المركبة" : "إضافة مركبة جديدة"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Plate & Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-right font-semibold">
                  <label className="text-sm font-medium text-gray-700">
                    رقم اللوحة
                  </label>
                  <div
                    className={`flex items-center gap-3 border rounded-xl px-3 py-3 transition-all ${
                      editMode
                        ? "bg-gray-200 border-gray-300 opacity-70 cursor-not-allowed"
                        : "bg-gray-50 border-gray-200 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73]"
                    }`}
                  >
                    <Hash size={18} className="text-[#0e6b73]" />
                    <input
                      type="text"
                      required
                      placeholder="مثال: ABC-123"
                      className="bg-transparent outline-none w-full text-sm text-black disabled:cursor-not-allowed"
                      value={formData.plateNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plateNumber: e.target.value,
                        })
                      }
                      disabled={editMode}
                    />
                  </div>
                  {editMode && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      * رقم اللوحة ثابت ولا يمكن تعديله
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    الموديل
                  </label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all">
                    <Truck size={18} className="text-[#0e6b73]" />
                    <input
                      type="text"
                      required
                      placeholder="تويوتا، مرسيدس..."
                      className="bg-transparent outline-none w-full text-sm text-black"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Driver Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  اسم السائق
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all">
                  <User size={18} className="text-[#0e6b73]" />
                  <input
                    type="text"
                    required
                    placeholder="الاسم ثلاثي"
                    className="bg-transparent outline-none w-full text-sm text-black"
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({ ...formData, driverName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Capacity & AC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    السعة (راكب)
                  </label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all">
                    <User size={18} className="text-[#0e6b73]" />
                    <input
                      type="number"
                      required
                      placeholder="14"
                      className="bg-transparent outline-none w-full text-sm text-black"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    التكييف
                  </label>
                  <div
                    className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isAirConditioned: !formData.isAirConditioned,
                      })
                    }
                  >
                    <Wind
                      size={18}
                      className={
                        formData.isAirConditioned
                          ? "text-blue-500"
                          : "text-gray-400"
                      }
                    />
                    <span
                      className={`text-sm flex-1 ${
                        formData.isAirConditioned
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.isAirConditioned ? "مكيف" : "غير مكيف"}
                    </span>
                    {formData.isAirConditioned && (
                      <Check size={16} className="text-blue-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  الحالة الأولية
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-3 bg-gray-50">
                  <Activity size={18} className="text-[#0e6b73]" />
                  <select
                    className="bg-transparent outline-none w-full text-sm text-black"
                    value={formData.currentStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentStatus: e.target.value,
                      })
                    }
                  >
                    <option value="idle">متاح (Idle)</option>
                    <option value="onRoute">في الطريق (On Route)</option>
                    <option value="maintenance">صيانة (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost rounded-xl text-gray-500 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn bg-[#0e6b73] text-white hover:bg-[#146f7b] rounded-xl px-8 shadow-md"
                >
                  {editMode ? "حفظ التعديلات" : "إضافة المركبة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;
