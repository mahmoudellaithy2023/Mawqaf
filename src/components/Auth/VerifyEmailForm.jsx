import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import { verifyEmail, resetAuthState } from "../../store/slices/authSlice";

export default function VerifyEmailForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isAuthenticated, message, pendingVerificationEmail } =
    useSelector((state) => state.auth);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  // ✅ focus على أول input عند mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (isError && message) {
      Swal.fire({ icon: "error", title: message });
      dispatch(resetAuthState());
    }

    if (isAuthenticated) {
      Swal.fire({ icon: "success", title: "تم التحقق بنجاح" }).then(() =>
        navigate("/")
      );
    }
  }, [isError, isAuthenticated, message, dispatch, navigate]);

  const handleChange = (element, index) => {
    if (/^[0-9]$/.test(element.value) || element.value === "") {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      if (element.value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);
      inputsRef.current[Math.min(pasteData.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) {
      Swal.fire({ icon: "warning", title: "كود التحقق غير مكتمل" });
      return;
    }
    dispatch(verifyEmail(code));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          أدخل كود التحقق
        </h2>

        <p className="text-center text-gray-500 mb-6">
          تم إرسال كود التحقق إلى بريدك الإلكتروني
          {pendingVerificationEmail && (
            <span className="block text-mainColor mt-1">
              {pendingVerificationEmail}
            </span>
          )}
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6" dir="ltr">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => (inputsRef.current[index] = el)}
              value={value}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="w-12 h-12 text-center text-xl border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-black transition-all"
            />
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-mainColor hover:bg-[#0f565d] text-white rounded-xl py-3 font-semibold shadow-lg transition"
        >
          {isLoading ? "جاري التحقق..." : "تأكيد"}
        </button>
      </div>
    </div>
  );
}
