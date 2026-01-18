import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import { forgotPassword, resetAuthState } from "../../store/slices/authSlice";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.forgotPassword
  );

  useEffect(() => {
    if (isError && message) {
      Swal.fire({ icon: "error", title: message });
      dispatch(resetAuthState());
    }

    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "تم إرسال كود التحقق!",
        text: "تحقق من بريدك الإلكتروني",
      }).then(() => navigate("/auth/verify-reset-code"));
      dispatch(resetAuthState());
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  const initialValues = { email: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("البريد غير صالح").required("البريد مطلوب"),
  });

  const handleSubmit = (values) => {
    dispatch(forgotPassword(values.email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="auth-card w-full max-w-md animate-slide-up p-6 bg-white rounded-2xl shadow-lg">
        <Link
          to="/auth"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة لتسجيل الدخول</span>
        </Link>

        <h2 className="text-2xl font-bold text-foreground mb-2 text-right">
          نسيت كلمة المرور؟
        </h2>
        <p className="text-muted-foreground mb-6 text-right">
          أدخل بريدك الإلكتروني وسنرسل لك كود التحقق
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div className="flex flex-col gap-2 text-right">
              <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <Field
                  name="email"
                  type="email"
                  disabled={isLoading}
                  placeholder="example@mail.com"
                  className="outline-none bg-transparent w-full text-right text-foreground"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-mainColor hover:bg-[#0f565d]"
              }`}
            >
              {isLoading ? "جاري الإرسال..." : "إرسال كود التحقق"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
