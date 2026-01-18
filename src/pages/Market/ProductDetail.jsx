// src/components/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, ArrowBigLeft } from "lucide-react";
import { productsData } from "./productsData";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/MarketPlace/cartSlice";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const product = productsData.find((p) => p.id === parseInt(id));
  const [currentImage, setCurrentImage] = useState(0);

  const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};
  const [reviews, setReviews] = useState(
    product ? [...(storedReviews[id] || []), ...(product.reviews || [])] : []
  );
  const [averageRating, setAverageRating] = useState(
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product?.rating || 0
  );

  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
  });

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );

  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      toast.success("تم إضافة المنتج للسلة!");
    }
  };

  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      toast.error("الرجاء ملء جميع الحقول والتقييم");
      return;
    }
    const reviewToAdd = { id: Date.now(), ...newReview };
    const updatedReviews = [reviewToAdd, ...reviews];
    setReviews(updatedReviews);
    setNewReview({ name: "", comment: "", rating: 0 });

    localStorage.setItem(
      "reviews",
      JSON.stringify({ ...storedReviews, [id]: updatedReviews })
    );
    toast.success("تم إضافة المراجعة!");
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      setAverageRating((total / reviews.length).toFixed(1));
    } else {
      setAverageRating(product?.rating || 0);
    }
  }, [reviews, product]);

  if (!product)
    return (
      <p className="text-center mt-40 text-xl text-gray-700">
        المنتج غير موجود
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster position="top-right" />

      {/* زر العودة */}
      <h1 className="text-3xl mt-18  text-mainColor font-bold">
        تفاصيل المنتج
      </h1>

      {/* كارد المنتج */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 mt-4">
        {/* سلايدر الصور */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="w-full h-72 object-cover rounded-xl border-2 border-mainColor"
          />
          <div className="flex gap-2 mt-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail ${idx}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  idx === currentImage ? "border-mainColor" : "border-gray-300"
                }`}
                onClick={() => setCurrentImage(idx)}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={prevImage}
              className="px-3 py-1 bg-mainColor text-white rounded hover:bg-mainColorHover transition"
            >
              السابق
            </button>
            <button
              onClick={nextImage}
              className="px-3 py-1 bg-mainColor text-white rounded hover:bg-mainColorHover transition"
            >
              التالي
            </button>
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1 flex flex-col gap-4 text-gray-800">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="font-semibold">{product.price} جنيه</p>
          <p className="text-sm text-gray-600">الفئة: {product.category}</p>

          {/* تقييم المنتج */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-gray-600 text-sm">
              {averageRating} من 5 ({reviews.length} مراجعة)
            </span>
          </div>

          <p className="text-gray-700">
            {product.description ||
              "هذا وصف تجريبي للمنتج. يمكنك إضافة وصف مفصل يوضح ميزات المنتج."}
          </p>

          {/* زر الشراء */}
          <button
            onClick={handleAddToCart}
            className={`mt-auto flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition ${
              isInCart
                ? "bg-gray-400 text-white cursor-default"
                : "bg-mainColor text-white hover:bg-mainColorHover"
            }`}
            disabled={isInCart}
          >
            {isInCart ? "تم الإضافة" : " اضافة الى السلة"}{" "}
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* إضافة مراجعة */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md text-gray-800">
        <h3 className="text-xl font-bold mb-4">أضف مراجعتك</h3>
        <input
          type="text"
          placeholder="اسمك"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="w-full px-4 py-3 mb-3 border-2 border-mainColor rounded-lg focus:ring-2 focus:ring-mainColor focus:outline-none transition text-gray-800"
        />
        <textarea
          placeholder="تعليقك"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          className="w-full px-4 py-3 mb-3 border-2 border-mainColor rounded-lg focus:ring-2 focus:ring-mainColor focus:outline-none transition resize-none text-gray-800"
          rows={4}
        />
        <div className="flex items-center gap-3 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={28}
              className={
                i < newReview.rating
                  ? "text-yellow-400 cursor-pointer transition-transform transform hover:scale-110"
                  : "text-gray-300 cursor-pointer transition-transform transform hover:scale-110"
              }
              onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
            />
          ))}
          <span className="text-gray-800 font-medium">
            {newReview.rating} من 5
          </span>
        </div>
        <button
          onClick={handleAddReview}
          className="w-full bg-mainColor text-white font-semibold px-6 py-3 rounded-lg hover:bg-mainColorHover transition"
        >
          إضافة المراجعة
        </button>
      </div>

      {/* عرض المراجعات */}
      <div className="mt-8 flex flex-col gap-4 text-gray-800">
        {reviews.length === 0 && (
          <p className="text-gray-500">لا توجد مراجعات حتى الآن</p>
        )}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-2 border-mainColor p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{review.name}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/marketplace")}
        className="bg-mainColor text-white mt-6 mx-auto px-10 py-2 flex items-center gap-2 rounded-lg font-semibold hover:bg-mainColorHover transition"
      >
        العودة إلى السوق <ArrowBigLeft size={20} />
      </button>
    </div>
  );
}
