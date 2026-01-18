import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { useDispatch, useSelector } from "react-redux";
import { register, resetAuthState } from "../../store/slices/authSlice";

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register: registerState } = useSelector((state) => state.auth);

  useEffect(() => {
    if (registerState.isError && registerState.message) {
      Swal.fire({
        icon: "error",
        title: registerState.message,
      });
      dispatch(resetAuthState());
    }

    if (registerState.isSuccess) {
      Swal.fire({
        icon: "success",
        title: "تم إنشاء الحساب بنجاح",
        text: "تم إرسال كود التحقق إلى بريدك",
      }).then(() => navigate("/auth/verify-email"));
    }
  }, [registerState.isError, registerState.isSuccess]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    lastName: Yup.string().required("اسم العائلة مطلوب"),
    email: Yup.string()
      .email("البريد غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف")
      .matches(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
      .matches(/[a-z]/, "يجب أن تحتوي على حرف صغير")
      .matches(/[0-9]/, "يجب أن تحتوي على رقم")
      .matches(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص")
      .required("كلمة المرور مطلوبة"),
  });

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-800 text-right">
        إنشاء حساب
      </h2>

      <p className="text-gray-500 text-sm text-right leading-relaxed">
        انضم إلينا لتخطط رحلاتك وتحجز مقاعدك بسهولة في أي وقت.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          {/* First Name */}
          <div className="flex flex-col gap-2 text-right">
            <label className="text-sm font-medium text-gray-600">
              الاسم الاول
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <User size={20} className="text-gray-500" />
              <Field
                name="firstName"
                type="text"
                placeholder="محمد"
                className="w-full text-right outline-none bg-transparent text-gray-700"
              />
            </div>
            <ErrorMessage
              name="firstName"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2 text-right mt-3">
            <label className="text-sm font-medium text-gray-600">
              اسم العائلة
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <User size={20} className="text-gray-500" />
              <Field
                name="lastName"
                type="text"
                placeholder="أحمد"
                className="w-full text-right outline-none bg-transparent text-gray-700"
              />
            </div>
            <ErrorMessage
              name="lastName"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 text-right mt-3">
            <label className="text-sm font-medium text-gray-600">
              البريد الإلكتروني
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <Mail size={20} className="text-gray-500" />
              <Field
                name="email"
                type="email"
                placeholder="example@mail.com"
                className="w-full text-right outline-none bg-transparent text-gray-700"
              />
            </div>
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 text-right mt-3 mb-4">
            <label className="text-sm font-medium text-gray-600">
              كلمة المرور
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <Lock size={20} className="text-gray-500" />
              <Field
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full text-right outline-none bg-transparent text-gray-700"
              />
            </div>
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، رقم، ورمز خاص
            </p>
          </div>

          <button
            type="submit"
            disabled={registerState.isLoading}
            className="w-full bg-mainColor hover:bg-[#0f565d] transition text-white rounded-xl py-3 font-semibold shadow-lg"
          >
            {registerState.isLoading
              ? "جاري إنشاء الحساب..."
              : "تسجيل الحساب"}
          </button>
        </Form>
      </Formik>

      <p className="text-center text-sm text-gray-500">
        لديك حساب؟{" "}
        <Link
          to="/auth/login"
          className="text-teal-700 font-semibold hover:opacity-70"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
