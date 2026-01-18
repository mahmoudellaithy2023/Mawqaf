// src/pages/marketPlace/Marketplace.jsx
import React, { useState } from "react";
import {
  Star,
  Search,
  Filter,
  Box,
  Settings,
  Gift,
  Wrench,
  ShoppingCart,
  Check,
  FileCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { productsData } from "./productsData";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/MarketPlace/cartSlice";
import { toast } from "react-hot-toast";

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};

  const categories = [
    { name: "الكل", icon: Box },
    { name: "إكسسوارات", icon: Gift },
    { name: "قطع غيار", icon: Settings },
    { name: "خدمات", icon: Wrench },
  ];

  const filteredProducts = productsData
    .filter((p) =>
      activeCategory === "الكل" ? true : p.category === activeCategory
    )
    .filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((p) => (maxPrice ? p.price <= parseInt(maxPrice) : true));

  const isInCart = (id) => cart.some((item) => item.id === id);

  const getAverageRating = (productId, defaultRating) => {
    const reviews = storedReviews[productId] || [];
    if (reviews.length === 0) return defaultRating;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / reviews.length);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8 px-4">
        <Box size={28} className="text-mainColor mt-19 ms-25" />
        <h1 className="text-3xl text-mainColor font-bold mt-19">سوق موقف</h1>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Filters Card */}
        <div className="w-full lg:w-72 bg-white rounded-xl shadow p-4 flex flex-col gap-6 mt-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-9 text-mainColor"
              size={18}
            />
            n
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-gray-400 border-mainColor rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
            />
          </div>

          {/* Max Price */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-3 text-mainColor"
              size={18}
            />
            <input
              type="number"
              placeholder="السعر الأقصى"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-gray-400 border-mainColor rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-gray-700 mb-2">الفئات</h4>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg font-medium transition
                      ${
                        active
                          ? "bg-mainColor text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-mainColor hover:text-white"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center justify-between px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColorHover"
            >
              <span>سلة التسوق</span>
              <ShoppingCart />
            </button>

            <button
              onClick={() => {
                const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
                if (!lastOrder) {
                  toast.error("لا يوجد أوردرات حالياً", { duration: 2500 });
                } else {
                  toast.success("الطلب جاهز للعرض!", { duration: 2000 });
                  navigate(`/order-confirmation/${lastOrder.id}`);
                }
              }}
              className="relative flex items-center justify-between px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColorHover"
            >
              <span>متابعة الطلب</span>
              <FileCheck />

              {/* Badge ديناميكي */}
              {(() => {
                const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
                const totalItems =
                  lastOrder?.items?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ) || 0;
                return totalItems > 0 ? (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2">
                    {totalItems}
                  </span>
                ) : null;
              })()}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              لا يوجد منتجات
            </p>
          )}

          {filteredProducts.map((product) => {
            const added = isInCart(product.id);
            const rating = getAverageRating(product.id, product.rating);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <Link to={`/marketplace/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-mainColor font-bold">
                      {product.price} جنيه
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < rating ? "text-yellow-400" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </Link>

                <button
                  disabled={added}
                  onClick={() => dispatch(addToCart(product))}
                  className={`m-4 rounded-lg py-2 font-semibold transition flex items-center justify-center gap-2
                    ${
                      added
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-mainColor text-white hover:bg-mainColorHover"
                    }`}
                >
                  {added ? (
                    <>
                      تم الإضافة <Check size={16} />
                    </>
                  ) : (
                    <>
                      أضف إلى السلة <ShoppingCart size={16} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
