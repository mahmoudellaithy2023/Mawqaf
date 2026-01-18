import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../../store/slices/authSlice";

import {  Eye, EyeOff } from "lucide-react";
import { useState } from "react";




export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.login
  );

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      Swal.fire({ icon: "error", title: message });
      dispatch(resetAuthState());
    }

    if (isSuccess && isAuthenticated && user) {
      Swal.fire({ icon: "success", title: "تم تسجيل الدخول بنجاح" });

      if (user?.role === "MANAGER") {
        navigate("/manager/dashboard");
      } else if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isError, isSuccess, isAuthenticated, message, dispatch, navigate, user]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("البريد غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "يجب ألا تقل كلمة المرور عن 6 أحرف")
      .required("كلمة المرور مطلوبة"),
  });

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 text-right">
          تسجيل الدخول
        </h2>
        <p className="text-gray-500 text-sm text-right mt-1 leading-relaxed">
          اكتشف المسارات، احجز المقاعد، وتنقل في وسائل النقل بسهولة.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 text-right">
              البريد الإلكتروني
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <Mail size={20} className="text-gray-500" />
              <Field
                name="email"
                type="email"
                placeholder="example@mail.com"
                className="outline-none bg-transparent w-full text-black text-right"
              />
            </div>
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 my-4">
              <label className="text-sm font-medium text-gray-600 text-right">
                كلمة المرور
              </label>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                <Lock size={20} className="text-gray-500" />

                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="outline-none bg-transparent w-full text-black text-right"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
          </div>


          <Link
            to="/auth/forgot-password"
            className="block text-sm text-teal-700 text-right font-medium py-3 hover:opacity-70 transition"
          >
            هل نسيت كلمة المرور؟
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-mainColor hover:bg-[#0f565d] transition text-white rounded-xl py-3 font-semibold shadow-lg"
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </Form>
      </Formik>

      <p className="text-center text-sm text-gray-500">
        ليس لديك حساب؟{" "}
        <Link
          to="/auth/register"
          className="text-teal-700 font-semibold hover:opacity-70"
        >
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}
