import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunityData } from "../../../store/slices/managerSlice";
import API from "../../../API/axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Trash2,
  EyeOff,
  CheckCircle,
  MessageSquare,
  Archive,
  AlertTriangle,
  Search,
  Calendar,
  XCircle,
} from "lucide-react";

const ManagerCommunity = () => {
  const dispatch = useDispatch();
  const { community } = useSelector((state) => state.manager);
  const { data: rawData, loading } = community;

  const [activeTab, setActiveTab] = useState("posts");
  const [subTab, setSubTab] = useState("all"); // all, hidden, deleted
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Local derived data from Redux state for filtering
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (activeTab === "posts" || activeTab === "reports") {
      dispatch(fetchCommunityData({ type: activeTab, subTab, page, category }));
    }
  }, [activeTab, subTab, page, category, dispatch]);

  const handlePageReset = () => {
    setPage(1);
  };

  useEffect(() => {
    if (!rawData) return;
    let processed = [...rawData];

    // Backend already handles hidden/deleted/all filtering for posts via API query params in Slice
    // So we just need frontend search/date filter on the returned result

    if (searchTerm) {
      processed = processed.filter((item) => {
        // Adapt based on item type (post or report)
        if (activeTab === "posts") {
          return (
            item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user?.firstName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.user?.lastName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        } else {
          // Report
          return item.reason?.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    if (dateFilter) {
      processed = processed.filter(
        (item) =>
          new Date(item.createdAt).toISOString().split("T")[0] === dateFilter
      );
    }

    setFilteredData(processed);
  }, [rawData, searchTerm, dateFilter, activeTab]);

  const handleAction = async (id, action, type) => {
    try {
      if (type === "post") {
        if (action === "hide")
          await API.patch(`/manager/community/posts/${id}/hide`);
        if (action === "activate")
          await API.patch(`/manager/community/posts/${id}/activate`);
        if (action === "delete")
          await API.delete(`/manager/community/posts/${id}`);
        toast.success("تم تنفيذ الإجراء بنجاح");
      } else if (type === "comment") {
        if (action === "hide")
          await API.patch(`/manager/community/comments/${id}/hide`);
        if (action === "activate")
          await API.patch(`/manager/community/comments/${id}/activate`);
        if (action === "delete")
          await API.delete(`/manager/community/comments/${id}`);
        toast.success("تم تنفيذ الإجراء بنجاح");
      } else if (type === "report") {
        if (action === "resolve")
          await API.patch(`/manager/community/reports/${id}/resolve`);
        toast.success("تم حل البلاغ");
      }
      dispatch(fetchCommunityData({ type: activeTab, subTab }));
    } catch (error) {
      console.error(error);
      toast.error("فشل في تنفيذ الإجراء");
    }
  };

  const handleDeleteAll = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف جميع المنشورات المحذوفة نهائياً ولا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;
    try {
      const res = await API.delete("/manager/community/posts/deleted");
      toast.success(res.data.message);
      dispatch(fetchCommunityData({ type: activeTab, subTab }));
    } catch (error) {
      console.error(error);
      toast.error("فشل في حذف المنشورات");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">إدارة المجتمع</h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div
          role="tablist"
          className="tabs tabs-boxed w-fit bg-white p-1 rounded-xl border border-gray-100 shadow-sm"
        >
          <a
            role="tab"
            className={`tab transition-all duration-300 rounded-lg px-6 ${
              activeTab === "posts"
                ? "bg-[#0e6b73] text-white font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("posts");
              setSubTab("all");
            }}
          >
            المنشورات
          </a>
          <a
            role="tab"
            className={`tab transition-all duration-300 rounded-lg px-6 ${
              activeTab === "reports"
                ? "bg-[#0e6b73] text-white font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            البلاغات
          </a>
        </div>

        {activeTab === "posts" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSubTab("all");
                handlePageReset();
              }}
              className={`btn btn-sm rounded-lg border-0 ${
                subTab === "all"
                  ? "bg-[#0e6b73] text-white hover:bg-[#146f7b]"
                  : "btn-ghost text-gray-500 hover:bg-gray-100"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => {
                setSubTab("hidden");
                handlePageReset();
              }}
              className={`btn btn-sm rounded-lg border-0 ${
                subTab === "hidden"
                  ? "bg-[#0e6b73] text-white hover:bg-[#146f7b]"
                  : "btn-ghost text-gray-500 hover:bg-gray-100"
              } gap-2`}
            >
              <EyeOff size={14} /> مخفية
            </button>
            <button
              onClick={() => {
                setSubTab("deleted");
                handlePageReset();
              }}
              className={`btn btn-sm rounded-lg border-0 ${
                subTab === "deleted"
                  ? "bg-[#0e6b73] text-white hover:bg-[#146f7b]"
                  : "btn-ghost text-gray-500 hover:bg-gray-100"
              } gap-2`}
            >
              <Trash2 size={14} /> محذوفة حديثاً
            </button>
          </div>
        )}
      </div>

      {activeTab === "posts" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setCategory("");
              handlePageReset();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              category === ""
                ? "bg-mainColor text-white border-mainColor"
                : "bg-white text-gray-500 border-gray-200 hover:border-mainColor"
            }`}
          >
            جميع الفئات
          </button>
          {[
            { id: "DISCUSSION", label: "مناقشة" },
            { id: "CAR_BOOKING", label: "حجز سيارة" },
            { id: "OPINION", label: "رأي" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                handlePageReset();
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                category === cat.id
                  ? "bg-mainColor text-white border-mainColor shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-mainColor"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Search and Date Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث في المنشورات (المحتوى أو اسم المستخدم)..."
            className="input input-bordered w-full rounded-xl pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#0e6b73] focus:ring-1 focus:ring-[#0e6b73]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="date"
            className="input input-bordered w-full md:w-48 rounded-xl pl-10 bg-white border-gray-300 text-gray-800 focus:outline-none focus:border-[#0e6b73] focus:ring-1 focus:ring-[#0e6b73]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 min-h-[400px] overflow-hidden">
        <div className="p-6">
          {activeTab === "posts" &&
            subTab === "deleted" &&
            rawData?.length > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDeleteAll}
                  className="btn btn-error btn-sm text-white gap-2"
                >
                  <Trash2 size={16} /> حذف الكل نهائياً
                </button>
              </div>
            )}

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : (
            <>
              {activeTab === "posts" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {subTab === "all" && "كل المنشورات"}
                    {subTab === "hidden" && "المنشورات المخفية"}
                    {subTab === "deleted" && "المنشورات المحذوفة حديثاً"}
                  </h2>
                  {rawData?.filter((post) => {
                    const matchesSearch =
                      post.content
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      post.user?.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      post.user?.lastName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase());

                    const matchesDate = dateFilter
                      ? new Date(post.createdAt).toISOString().split("T")[0] ===
                        dateFilter
                      : true;

                    return matchesSearch && matchesDate;
                  }).length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                      لا توجد منشورات تطابق بحثك
                    </div>
                  ) : (
                    rawData
                      .filter((post) => {
                        const matchesSearch =
                          post.content
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          post.user?.firstName
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          post.user?.lastName
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase());

                        const matchesDate = dateFilter
                          ? new Date(post.createdAt)
                              .toISOString()
                              .split("T")[0] === dateFilter
                          : true;

                        return matchesSearch && matchesDate;
                      })
                      .map((post) => (
                        <div
                          key={post._id}
                          className="flex justify-between items-start p-4 bg-gray-50 rounded-xl border border-gray-100" // Added mb-4 for spacing if needed, but flex gap handles it usually. Wait, this is a list.
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-800">
                                {post.user?.firstName} {post.user?.lastName}
                              </p>
                              {post.status === "HIDDEN" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  مخفي
                                </span>
                              )}
                              {post.status === "DELETED" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  محذوف
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">{post.content}</p>
                            <div className="flex gap-2 mt-2 text-xs text-gray-400">
                              <span>
                                {new Date(post.createdAt).toLocaleDateString(
                                  "ar-EG"
                                )}
                              </span>
                              <span>• {post.likesCount || 0} إعجاب</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {(post.status === "HIDDEN" ||
                              post.status === "DELETED") && (
                              <button
                                onClick={() =>
                                  handleAction(post._id, "activate", "post")
                                }
                                className="btn btn-sm btn-ghost text-green-600"
                                title="إعادة تفعيل"
                              >
                                <CheckCircle size={16} />
                                إظهار
                              </button>
                            )}
                            {post.status !== "HIDDEN" &&
                              post.status !== "DELETED" && (
                                <button
                                  onClick={() =>
                                    handleAction(post._id, "hide", "post")
                                  }
                                  className="btn btn-sm btn-ghost text-orange-500"
                                  title="إخفاء"
                                >
                                  <EyeOff size={16} />
                                  إخفاء
                                </button>
                              )}
                            {post.status !== "DELETED" && (
                              <button
                                onClick={() =>
                                  handleAction(post._id, "delete", "post")
                                }
                                className="btn btn-sm btn-ghost text-red-500"
                                title="حذف"
                              >
                                <Trash2 size={16} />
                                حذف
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  )}

                  {activeTab === "posts" &&
                    community.currentPage < community.totalPages && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={loading}
                          className="btn bg-white border-gray-200 text-mainColor hover:bg-gray-50 rounded-xl px-10 gap-2 border-2"
                        >
                          {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "عرض المزيد من المنشورات"
                          )}
                        </button>
                      </div>
                    )}
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    إدارة البلاغات
                  </h2>
                  {filteredData.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                      لا توجد بلاغات معلقة
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredData.map((report) => (
                        <div
                          key={report._id}
                          className="flex flex-col p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-red-100 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                <AlertTriangle size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  بانتظار المراجعة: {report.reason}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  بواسطة: {report.user?.firstName}{" "}
                                  {report.user?.lastName} •{" "}
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString("ar-EG")}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {report.status !== "RESOLVED" && (
                                <>
                                  {report.targetId?.status === "HIDDEN" ||
                                  report.targetId?.status === "DELETED" ? (
                                    <button
                                      onClick={() =>
                                        handleAction(
                                          report.targetId._id,
                                          "activate",
                                          report.targetModel.toLowerCase()
                                        )
                                      }
                                      className="btn btn-sm bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                                      title="إعادة تفعيل"
                                    >
                                      <CheckCircle size={16} />
                                      إستعادة
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleAction(
                                          report.targetId._id,
                                          "hide",
                                          report.targetModel.toLowerCase()
                                        )
                                      }
                                      className="btn btn-sm bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100"
                                      title="إخفاء المحتوى"
                                    >
                                      <EyeOff size={16} />
                                      إخفاء
                                    </button>
                                  )}

                                  {report.targetId?.status !== "DELETED" && (
                                    <button
                                      onClick={() =>
                                        handleAction(
                                          report.targetId._id,
                                          "delete",
                                          report.targetModel.toLowerCase()
                                        )
                                      }
                                      className="btn btn-sm bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                      title="حذف المحتوى"
                                    >
                                      <Trash2 size={16} />
                                      حذف
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleAction(
                                        report._id,
                                        "resolve",
                                        "report"
                                      )
                                    }
                                    className="btn btn-sm bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:border-green-200"
                                  >
                                    <CheckCircle size={16} className="ml-1" />
                                    حل البلاغ
                                  </button>
                                </>
                              )}
                              {report.status === "RESOLVED" && (
                                <span className="badge badge-success gap-1 py-3 px-4">
                                  <CheckCircle size={14} /> تم الحل
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {report.targetModel === "Post"
                                  ? "المنشور المبلّغ عنه"
                                  : "التعليق المبلّغ عنه"}
                              </span>
                            </div>

                            {report.targetId ? (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 line-clamp-3">
                                  {report.targetId.content}
                                </p>
                                {report.targetId.media && (
                                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    {report.targetId.mediaType === "IMAGE" ? (
                                      <img
                                        src={`/${report.targetId.media}`}
                                        alt="Reported content"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <EyeOff
                                          size={20}
                                          className="text-gray-400"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 italic">
                                تم حذف المحتوى الأصلي
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCommunity;
