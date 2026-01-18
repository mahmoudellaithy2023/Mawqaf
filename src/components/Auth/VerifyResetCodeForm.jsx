import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import {
  verifyPasswordCode,
  resetAuthState,
} from "../../store/slices/authSlice";

export default function VerifyResetCodeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message, resetToken } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (isError && message) {
      Swal.fire({ icon: "error", title: message });
      dispatch(resetAuthState());
    }

    if (resetToken) {
      navigate(`/auth/reset-password/${resetToken}`);
      dispatch(resetAuthState());
    }
  }, [isError, message, resetToken, dispatch, navigate]);

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
    dispatch(verifyPasswordCode(code));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      {/* Back */}
      <Link
        to="/auth/forgot-password"
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-mainColor transition self-end"
      >
        <ArrowRight size={18} />
        العودة
      </Link>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 text-right">
          أدخل كود التحقق
        </h2>
        <p className="text-gray-500 text-sm text-right mt-1">
          تم إرسال كود التحقق إلى بريدك الإلكتروني
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-between gap-2 mt-4" dir="ltr">
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
            className="w-12 h-12 text-center text-xl border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-mainColor transition text-black"
          />
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleVerify}
        disabled={isLoading}
        className="w-full bg-mainColor hover:bg-[#0f565d] transition text-white rounded-xl py-3 font-semibold shadow-lg mt-4"
      >
        {isLoading ? "جاري التحقق..." : "تأكيد"}
      </button>
    </div>
  );
}
