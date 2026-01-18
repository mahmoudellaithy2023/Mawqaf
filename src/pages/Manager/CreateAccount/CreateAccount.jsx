import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Mail, Lock, User, Shield, X } from "lucide-react";
import {
  createUserAccount,
  verifyUserEmail,
} from "../../../store/slices/managerSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const CreateAccount = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.manager);

  const [formData, setFormData] = useState({
    firstName: "موقف",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }

    // Station Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "اسم الموقف مطلوب";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    try {
      await dispatch(
        createUserAccount({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        })
      ).unwrap();

      // Show verification modal
      setShowVerificationModal(true);
    } catch (error) {
      toast.error(error || "فشل في إنشاء الحساب");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }

    setVerifying(true);
    try {
      await dispatch(verifyUserEmail({ verificationCode })).unwrap();

      // Close modal
      setShowVerificationModal(false);
      setVerificationCode("");

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "تم إنشاء الحساب بنجاح!",
        text: "تم التحقق من البريد الإلكتروني وإنشاء الحساب بنجاح",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#0e6b73",
      });

      // Reset form
      setFormData({
        firstName: "موقف",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
      });
      setErrors({});
    } catch (error) {
      toast.error(error || "رمز التحقق غير صحيح");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-mainColor flex items-center justify-center text-white shadow-md">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إنشاء حساب جديد</h1>
          <p className="text-gray-600 mt-1">
            إضافة مستخدم جديد أو مشرف إلى النظام
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name - Fixed as "موقف" */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <User className="inline w-4 h-4 ml-1" />
                النوع
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Last Name - Station Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <User className="inline w-4 h-4 ml-1" />
                اسم الموقف
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all text-right ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="المعادي"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 ml-1" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="ahmed@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 ml-1" />
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="*****"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 ml-1" />
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="*****"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 ml-1" />
              الدور
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all bg-white"
            >
              <option value="USER">مستخدم (USER)</option>
              <option value="ADMIN">مشرف (ADMIN)</option>
            </select>
            <p className="text-gray-500 text-sm mt-2">
              {formData.role === "ADMIN"
                ? "المشرف يمكنه إدارة الخطوط والمركبات"
                : "المستخدم العادي يمكنه استخدام النظام فقط"}
            </p>
          </div>

          {/* Password Requirements Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              متطلبات كلمة المرور:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>8 أحرف على الأقل</li>
              <li>حرف كبير وحرف صغير</li>
              <li>رقم واحد على الأقل</li>
              <li>رمز خاص واحد على الأقل (@$!%*?&)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-mainColor text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0a5158] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Verification Modal - Overlay */}
      {showVerificationModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100 animate-in">
            {/* Close Button */}
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-mainColor rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                تحقق من البريد الإلكتروني
              </h2>
              <p className="text-gray-600">
                تم إرسال رمز التحقق إلى البريد الإلكتروني
              </p>
              <p className="text-mainColor font-medium mt-1">
                {formData.email}
              </p>
            </div>

            {/* Verification Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                أدخل رمز التحقق المكون من 6 أرقام
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                }}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor transition-all text-center text-2xl font-bold tracking-widest"
                placeholder="ضع الكود هنا"
                maxLength={6}
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyCode}
              disabled={verifying || verificationCode.length !== 6}
              type="button"
              className="w-full bg-mainColor text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0a5158] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {verifying ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  جاري التحقق...
                </>
              ) : (
                "تحقق من الرمز"
              )}
            </button>

            {/* Resend Code */}
            <p className="text-center text-sm text-gray-600 mt-4">
              لم تستلم الرمز؟{" "}
              <button
                type="button"
                className="text-mainColor font-medium hover:underline"
              >
                إعادة الإرسال
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
