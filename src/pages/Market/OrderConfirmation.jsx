import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PackageCheck,
  DollarSign,
  Truck,
  ClipboardList,
  ShoppingCart,
} from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const orders = useSelector((state) => state.orders.orders);

  // تحميل آخر طلب بشكل آمن
  let lastOrder = null;
  try {
    lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    lastOrder = null;
  }

  // جلب الطلب (من Redux أو localStorage)
  const order = useMemo(() => {
    return (
      orders.find((o) => String(o.id) === String(id)) ||
      lastOrder ||
      null
    );
  }, [orders, id]);

  if (!order) {
    return (
      <p className="text-center mt-40 text-gray-600 text-lg">
        لا يوجد بيانات للطلب
      </p>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 md:p-8 relative">
        {/* Badge عدد المنتجات */}
        <div className="absolute top-4 left-4 bg-mainColor text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
          <ShoppingCart size={16} />
          {order.items?.length || 0}
        </div>

        <h2 className="text-3xl font-bold mb-6 text-mainColor text-center">
          تم إنشاء الطلب بنجاح
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <p className="flex items-center gap-2 text-gray-800">
            <ClipboardList size={20} className="text-mainColor" />
            رقم الطلب:
            <span className="font-semibold">{order.id}</span>
          </p>

          <p className="flex items-center gap-2 text-gray-800">
            <DollarSign size={20} className="text-mainColor" />
            الإجمالي:
            <span className="font-semibold">
              {order.total} جنيه
            </span>
          </p>

          <p className="flex items-center gap-2 text-gray-800">
            <PackageCheck size={20} className="text-mainColor" />
            الحالة:
            <span
              className={`font-semibold ${
                order.paid ? "text-green-600" : "text-red-500"
              }`}
            >
              {order.paid ? "مدفوع" : "غير مدفوع"}
            </span>
          </p>

          <p className="flex items-center gap-2 text-gray-800">
            <Truck size={20} className="text-mainColor" />
            التوصيل:
            <span
              className={`font-semibold ${
                order.delivered
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {order.delivered ? "تم التوصيل" : "جارى التجهيز"}
            </span>
          </p>
        </div>

        <h3 className="text-xl font-bold mb-2">المنتجات:</h3>
        <ul className="list-disc list-inside mb-6 max-h-48 overflow-auto">
          {order.items?.map((item) => (
            <li
              key={item.id}
              className="text-gray-700 py-1 hover:bg-gray-50 rounded-lg px-2 transition"
            >
              {item.name} — {item.quantity} × {item.price} جنيه
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate("/marketplace")}
          className="w-full bg-mainColor text-white py-3 rounded-2xl font-semibold hover:bg-mainColorHover transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          العودة إلى السوق
        </button>
      </div>
    </div>
  );
}
