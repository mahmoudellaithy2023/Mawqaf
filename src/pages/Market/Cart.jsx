// src/components/Cart.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, ShoppingCart, Trash2 } from "lucide-react";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "../../store/slices/MarketPlace/cartSlice";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const [expandedId, setExpandedId] = useState(null);
  const [checkoutModal, setCheckoutModal] = useState(false);

  const total = cart
    .reduce((sum, p) => sum + p.price * p.quantity, 0)
    .toFixed(2);

  if (cart.length === 0)
    return (
      <div className="text-center py-60">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          سلة التسوق فارغة
        </h2>
        <button
          onClick={() => navigate("/marketplace")}
          className="bg-mainColor text-white px-6 py-2 rounded-lg font-semibold hover:bg-mainColorHover transition flex items-center justify-center gap-2 mx-auto"
        >
          العودة إلى السوق
          <ArrowBigLeft size={20} />
        </button>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mt-10 flex gap-2 items-center text-mainColor">
        سلة التسوق <ShoppingCart size={25} />
      </h2>

      <div className="grid grid-cols-1 gap-4 mt-7">
        {cart.map((product) => {
          const isExpanded = expandedId === product.id;

          return (
            <div
              key={product.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 hover:scale-105 transition-transform"
                />
                <div className="max-w-md flex flex-col">
                  <h3
                    className={`font-semibold text-lg leading-snug text-gray-800 ${
                      !isExpanded ? "line-clamp-2" : ""
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p className="text-mainColor font-bold mt-1">
                    {product.price} جنيه
                  </p>
                  {product.name.length > 40 && (
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : product.id)
                      }
                      className="text-mainColor text-sm mt-1 hover:underline"
                    >
                      {isExpanded ? "عرض أقل" : "عرض المزيد"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto mt-3 md:mt-0">
                <button
                  onClick={() =>
                    product.quantity > 1 && dispatch(decreaseQty(product.id))
                  }
                  className="px-3 py-1 bg-mainColor rounded hover:bg-mainColorHover transition"
                >
                  -
                </button>
                <span className="font-medium min-w-[20px] text-center text-gray-800">
                  {product.quantity}
                </span>
                <button
                  onClick={() => dispatch(increaseQty(product.id))}
                  className="px-3 py-1 bg-mainColor rounded hover:bg-mainColorHover transition"
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeFromCart(product.id))}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* الإجمالي + إتمام الشراء */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-gray-800">
          الإجمالي: {total} جنيه
        </h3>
        <button
          onClick={() => setCheckoutModal(true)}
          className="bg-mainColor text-white px-6 py-2 rounded-lg font-semibold hover:bg-mainColorHover transition"
        >
          إتمام الشراء
        </button>
      </div>

      {/* مودال الدفع */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setCheckoutModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              اختر طريقة الدفع
            </h3>
            <div className="flex flex-col gap-4">
              <button className="w-full bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-mainColorHover transition">
                الدفع أونلاين
              </button>
              <button
                onClick={() =>
                  navigate("/cash-payment", { state: { total, cart } })
                }
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                الدفع كاش عند الاستلام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* رجوع للسوق */}
      <button
        onClick={() => navigate("/marketplace")}
        className="bg-mainColor text-white mt-6 mx-auto px-10 py-2 flex items-center gap-2 rounded-lg font-semibold hover:bg-mainColorHover transition"
      >
        العودة إلى السوق <ArrowBigLeft size={20} />
      </button>
    </div>
  );
}