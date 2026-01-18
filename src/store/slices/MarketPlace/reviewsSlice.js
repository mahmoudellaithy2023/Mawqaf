// src/Store/Slices/reviewsSlice.js
import { createSlice } from "@reduxjs/toolkit";

// لو في LocalStorage، استرجع البيانات
const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};

const saveToLocalStorage = (reviews) => {
  localStorage.setItem("reviews", JSON.stringify(reviews));
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: storedReviews,
  reducers: {
    addReview: (state, action) => {
      const { productId, review } = action.payload;
      if (!state[productId]) state[productId] = [];
      state[productId].push(review);
      saveToLocalStorage(state); // احفظ على طول بعد كل إضافة
    },
  },
});

export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;