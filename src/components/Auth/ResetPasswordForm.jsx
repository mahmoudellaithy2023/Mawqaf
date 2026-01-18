import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import { resetPassword, resetAuthState } from "../../store/slices/authSlice";

export default function ResetPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { isLoading, isError, message, resetToken } = useSelector(
    (state) => state.auth
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isError && message) {
      Swal.fire({ icon: "error", title: message });
      dispatch(resetAuthState());
    }

    if (!resetToken && !isLoading && !isError) {
      Swal.fire({
        icon: "success",
        title: "تم تحديث كلمة المرور بنجاح!",
      }).then(() => navigate("/auth/login"));
    }
  }, [isError, message, resetToken, isLoading, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      Swal.fire({ icon: "warning", title: "الرجاء إدخال جميع الحقول" });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "كلمة المرور غير متطابقة" });
      return;
    }

    dispatch(resetPassword({ token, newPassword: password, confirmPassword }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 animate-slide-up">
        <Link
          to="/auth/forgot-password"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          العودة
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          إعادة تعيين كلمة المرور
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              كلمة المرور الجديدة
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور الجديدة"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-black bg-gray-50 transition"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              تأكيد كلمة المرور
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-black bg-gray-50 transition"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-mainColor hover:bg-[#0f565d] text-white py-3 rounded-xl font-semibold shadow-lg transition"
          >
            {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
