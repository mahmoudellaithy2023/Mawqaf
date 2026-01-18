// src/components/CashPayment.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../../store/slices/MarketPlace/ordersSlice";
import { clearCart } from "../../store/slices/MarketPlace/cartSlice";
import { toast } from "react-hot-toast";
import { User, Phone, MapPin } from "lucide-react";

export default function CashPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  const total = cart
    .reduce((sum, p) => sum + p.price * p.quantity, 0)
    .toFixed(2);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  if (!cart || cart.length === 0) {
    return (
      <p className="text-center mt-40 text-lg text-gray-600">
        لا يوجد منتجات في السلة
      </p>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
    if (!form.lastName.trim()) newErrors.lastName = "الاسم الأخير مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^\d{10,11}$/.test(form.phone))
      newErrors.phone = "رقم الهاتف غير صحيح";
    if (!form.address.trim()) newErrors.address = "العنوان مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    const orderData = {
      id: Date.now(),
      items: cart,
      total,
      ...form,
      paid: false,
      delivered: false,
    };

    dispatch(addOrder(orderData));
    dispatch(clearCart());
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    toast.success("تم تأكيد الطلب!", { duration: 2000 });

    navigate(`/order-confirmation/${orderData.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl my-19 shadow-xl p-8 hover:shadow-2xl transition-all">
        <h2 className="text-3xl font-bold text-mainColor text-center mb-3">
          الدفع عند الاستلام
        </h2>
        <p className="text-center text-gray-600 mb-6">
          من فضلك أدخل بياناتك لإتمام الطلب
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 text-center shadow-sm">
          <span className="text-gray-600 font-medium">إجمالي المبلغ</span>
          <p className="text-2xl font-bold text-mainColor mt-1">{total} جنيه</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* الاسم الأول */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-mainColor" size={18} />
            <input
              type="text"
              placeholder="الاسم الأول"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none transition
                ${
                  errors.firstName
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-mainColor"
                } text-black placeholder-gray-500 hover:shadow-md`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* الاسم الأخير */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-mainColor" size={18} />
            <input
              type="text"
              placeholder="الاسم الأخير"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none transition
                ${
                  errors.lastName
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-mainColor"
                } text-black placeholder-gray-500 hover:shadow-md`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* الهاتف */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-mainColor" size={18} />
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none transition
                ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-mainColor"
                } text-black placeholder-gray-500 hover:shadow-md`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* العنوان */}
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3 text-mainColor"
              size={18}
            />
            <textarea
              placeholder="العنوان بالتفصيل"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 resize-none focus:outline-none transition
                ${
                  errors.address
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-mainColor"
                } text-black placeholder-gray-500 hover:shadow-md`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* زر التأكيد */}
          <button
            onClick={handleConfirm}
            className="mt-6 bg-mainColor text-white py-3 rounded-2xl font-semibold
              hover:bg-mainColorHover transition active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            تأكيد الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
