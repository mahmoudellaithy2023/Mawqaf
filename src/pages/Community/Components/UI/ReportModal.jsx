import { useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, Send } from "lucide-react";
import API from "../../../../API/axios";
import { toast } from "react-hot-toast";

const ReportModal = ({ targetId, targetModel, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    "محتوى غير لائق",
    "سب أو قذف",
    "معلومات مضللة",
    "محتوى يحرض على الكراهية",
    "أخرى",
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("يرجى اختيار سبب للبلاغ");
      return;
    }

    try {
      setLoading(true);
      await API.post("/community/report", {
        targetId,
        targetModel,
        reason,
      });
      toast.success("تم إرسال البلاغ بنجاح، سيقوم المشرف بمراجعته");
      onClose();
    } catch (error) {
      console.error("Report error:", error);
      toast.error("فشل في إرسال البلاغ");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 text-mainColor font-bold">
            <div className="p-2 bg-mainColor/10 rounded-xl">
              <AlertTriangle size={22} />
            </div>
            <span className="text-lg">إبلاغ عن {targetModel === "Post" ? "منشور" : "تعليق"}</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <p className="text-sm text-muted-foreground text-right leading-relaxed">
            نحن نأخذ التقارير على محمل الجد. من فضلك اختر السبب الأكثر دقة لوصف هذا المحتوى:
          </p>
          
          <div className="space-y-3">
            {reasons.map((r) => (
              <label 
                key={r}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  reason === r 
                    ? "border-mainColor bg-mainColor/5 text-mainColor shadow-sm" 
                    : "border-gray-50 bg-gray-50/30 text-gray-600 hover:border-gray-200 hover:bg-gray-50/60"
                }`}
              >
                <input 
                  type="radio" 
                  name="reason" 
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="radio radio-primary radio-sm border-gray-300 checked:border-mainColor"
                  style={{ "--chkbg": "var(--color-mainColor)", "--chkfg": "white" }}
                />
                <span className="text-sm font-semibold w-full text-right">{r}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:text-foreground hover:bg-gray-100 rounded-2xl transition-all"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-mainColor text-white rounded-2xl px-4 py-3 text-sm font-bold hover:bg-mainColorHover transition-all shadow-lg shadow-mainColor/25 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : <Send size={18} className="rotate-180" />}
            إرسال البلاغ
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ReportModal;
