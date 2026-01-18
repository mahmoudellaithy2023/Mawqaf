// src/Store/Slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";

// تحميل الطلبات من localStorage
const loadOrders = () => {
  try {
    const data = localStorage.getItem("orders");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  orders: loadOrders(),
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);

      // حفظ في localStorage
      localStorage.setItem("orders", JSON.stringify(state.orders));
      localStorage.setItem("lastOrder", JSON.stringify(action.payload));
    },

    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem("orders");
      localStorage.removeItem("lastOrder");
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
