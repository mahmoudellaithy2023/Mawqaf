import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Check, X, MapPin, DollarSign, Route } from "lucide-react";
import API from "../../../API/axios";
import { toast } from "react-hot-toast";
import useAdminStation from "../../../hooks/useAdminStation";

const AdminLines = () => {
    const { station, loading: stationLoading } = useAdminStation();
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Stations for Dropdown
    const [allStations, setAllStations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for dropdown container

    // Form and UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedLineId, setSelectedLineId] = useState(null);
    const [formData, setFormData] = useState({ to: "", distance: "", price: "" });

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchLines = async () => {
        if (!station?._id) return;
        setLoading(true);
        try {
            const res = await API.get(`/station/${station._id}/lines`);
            setLines(res.data.results || []);
            setLoading(false);
        } catch (error) {
            console.error("Fetch lines error", error);
            toast.error("فشل في تحميل الخطوط");
            setLoading(false);
        }
    };

    const fetchAllStations = async () => {
        try {
            // Updated to fetch limit=1000
            const res = await API.get("/station?limit=1000");
             // Filter out current station from "To" options to prevent self-loop
            const stations = res.data.data.filter(s => s._id !== station?._id) || [];
            setAllStations(stations);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (station) {
            fetchLines();
            fetchAllStations();
        }
    }, [station]);

    // Handle Click Outside Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleOpenModal = (line = null) => {
        if (line) {
            setEditMode(true);
            setSelectedLineId(line._id);
            setFormData({ 
                to: line.toStation?._id || (typeof line.toStation === 'string' ? line.toStation : "") || "", 
                distance: line.distance || "",
                price: line.price || ""
            });
            // Set search query to the station name if possible
            const toStationName = line.toStation?.stationName || "";
            setSearchQuery(toStationName);
        } else {
            setEditMode(false);
            setFormData({ to: "", distance: "", price: "" });
            setSearchQuery("");
        }
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate To Station
            if (!formData.to) {
                toast.error("يرجى اختيار محطة الوصول");
                return;
            }

            const payload = { 
                toStation: formData.to, 
                distance: Number(formData.distance), 
                price: Number(formData.price) 
            };
            
            if (editMode) {
                await API.put(`/station/${station._id}/lines/${selectedLineId}`, payload);
                toast.success("تم تحديث الخط بنجاح");
            } else {
                await API.post(`/station/${station._id}/lines`, payload);
                toast.success("تم إضافة الخط بنجاح");
            }
            setIsModalOpen(false);
            fetchLines();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "فشل في حفظ البيانات");
        }
    };

    const handleDelete = async (line) => {
        try {
            const toStationIds = typeof line.toStation === 'object' ? line.toStation._id : line.toStation;
            console.log( "mmmmmm" ,toStationIds);
            await API.delete(`/station/${station._id}/lines/${line._id}`, {
                params: { toStation: toStationIds }
            });
            toast.success("تم حذف الخط بنجاح");
            fetchLines();
            setDeleteConfirmId(null);
        } catch (error) {
            console.error(error);
            toast.error("فشل في حذف الخط");
        }
    };

    // Filter stations based on search
    const filteredStations = allStations.filter(s => 
        s.stationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (stationLoading) return <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>;
    if (!station) return <div className="text-center p-10">لا توجد محطة معينة</div>;

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الخطوط - {station.stationName}</h1>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="flex items-center gap-2 px-6 py-3 bg-[#0e6b73] text-white rounded-xl hover:bg-[#146f7b] transition shadow-lg font-medium"
                >
                    <Plus size={20} /> إضافة خط جديد
                </button>
            </div>

            <div className="overflow-visible bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                <table className="table w-full">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-100 text-right text-sm">
                             <th className="py-4 pr-6">الاسم</th>
                            <th>الأصل</th>
                            <th>الوجهة</th>
                            <th>المسافة</th>
                            <th>السعر</th>
                            <th className=" text-center">  الإجراءات  </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-12 text-gray-400">لا توجد خطوط حالياً</td></tr>
                        ) : lines.map((line) => (
                            <tr key={line._id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors">
                                <td className="py-4 pr-6 font-semibold text-gray-800 text-right">{ "خط " + line._id.substr(-4)}</td>
                                <td className="text-gray-600 text-right">{line.fromStation?.stationName || line.fromStation || "-"}</td>
                                <td className="text-gray-600 text-right">{line.toStation?.stationName || line.toStation || "-"}</td>
                                <td className="text-right"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">{line.distance} كم</span></td>
                                <td className="text-right text-emerald-600 font-medium">{line.price} ج.م</td>
                                <td className=" text-center  pl-6">
                                    <div className="flex items-center justify-center gap-6">
                                        <button onClick={() => handleOpenModal(line)} className="btn btn-sm btn-ghost text-[#0e6b73] hover:bg-[#0e6b73]/10">تعديل</button>
                                        
                                        {/* Modern Toggle Delete Button */}
                                        {deleteConfirmId === line._id ? (
                                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                                                 <button 
                                                    onClick={() => handleDelete(line)} 
                                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
                                                >
                                                    تأكيد الحذف
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
                                                onClick={() => setDeleteConfirmId(line._id)} 
                                                className="btn btn-sm btn-ghost text-red-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-2xl font-bold text-gray-800">{editMode ? "تعديل بيانات الخط" : "إضافة خط جديد"}</h2>
                             <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
                        </div>
                       
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* From Station - Fixed Readonly */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-600 text-right">محطة الانطلاق</label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed">
                                    <MapPin size={20} className="text-gray-400" />
                                    <span className="text-gray-500 font-medium">{station.stationName}</span>
                                </div>
                            </div>

                            {/* To Station - Searchable Dropdown */}
                            <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                                <label className="text-sm font-medium text-gray-600 text-right">محطة الوصول</label>
                                <div 
                                    className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all"
                                    onClick={() => setIsDropdownOpen(true)}
                                >
                                    <MapPin size={20} className="text-[#0e6b73]" />
                                    <input 
                                        type="text" 
                                        placeholder="ابحث عن المحطة..." 
                                        className="outline-none bg-transparent w-full text-black text-right placeholder:text-gray-400"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                    />
                                </div>
                                
                                {/* Dropdown List */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-10 custom-scrollbar">
                                        {filteredStations.length > 0 ? (
                                            filteredStations.map(stat => (
                                                <div 
                                                    key={stat._id} 
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition"
                                                    onClick={() => {
                                                        setFormData({...formData, to: stat._id});
                                                        setSearchQuery(stat.stationName);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className="text-gray-700">{stat.stationName}</span>
                                                    {formData.to === stat._id && <Check size={16} className="text-[#0e6b73]" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-400 text-center text-sm">لا توجد محطات مطابقة</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Distance & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-600 text-right">المسافة (كم)</label>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all">
                                        <Route size={20} className="text-[#0e6b73]" />
                                        <input 
                                            type="number" 
                                            required 
                                            placeholder="0"
                                            className="outline-none bg-transparent w-full text-black text-right"
                                            value={formData.distance} 
                                            onChange={e => setFormData({...formData, distance: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-600 text-right">السعر</label>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-[#0e6b73] focus-within:ring-1 focus-within:ring-[#0e6b73] transition-all">
                                        <DollarSign size={20} className="text-[#0e6b73]" />
                                        <input 
                                            type="number" 
                                            required 
                                            placeholder="0"
                                            className="outline-none bg-transparent w-full text-black text-right"
                                            value={formData.price} 
                                            onChange={e => setFormData({...formData, price: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost rounded-xl text-gray-500 hover:bg-gray-100">إلغاء</button>
                                <button type="submit" className="btn bg-[#0e6b73] text-white hover:bg-[#146f7b] rounded-xl px-8 shadow-md">
                                    {editMode ? "حفظ التعديلات" : "إضافة الخط"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLines;
