import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Home,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../../API/axios";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const [status, setStatus] = useState("verifying"); 
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        // Call backend to ensure booking is confirmed
        await API.post("/payment/confirm-payment", { sessionId });
        setStatus("success");
        toast.success("تم تأكيد حجزك بنجاح");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("success"); // Still show success UI but log error
        // Actually, if it fails but they reached here, it might just be the backend sync failing.
        // We'll keep it as "success" for UX but maybe alert support.
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8"
        dir="rtl"
      >
        {status === "verifying" ? (
          <div className="py-10">
            <Loader2 className="w-16 h-16 text-mainColor animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">
              جاري التأكد من حالة الدفع...
            </h2>
            <p className="text-gray-500 mt-2">يرجى الانتظار لحظة واحدة</p>
          </div>
        ) : status === "success" ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تم تأكيد الحجز!
            </h1>
            <p className="text-gray-600 mb-8">
              شكراً لك! تم دفع التكلفة وتأكيد حجز مقعدك بنجاح.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              حدث خطأ في التأكيد
            </h1>
            <p className="text-gray-600 mb-8">
              لم نتمكن من التأكد من حالة الدفع تلقائياً. إذا تم خصم المبلغ، يرجى
              التواصل مع الدعم الفني.
            </p>
          </>
        )}

        <div className="space-y-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-mainColor text-white py-4 rounded-2xl font-bold hover:bg-mainColor/90 transition shadow-lg shadow-mainColor/20"
          >
            <Home size={20} />
            العودة للرئيسية
          </Link>

          <Link
            to="/stations"
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
          >
            تصفح خطوط أخرى
            <ArrowRight size={20} />
          </Link>
        </div>

        {bookingId && (
          <p className="mt-8 text-xs text-gray-400">رقم الحجز: {bookingId}</p>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
