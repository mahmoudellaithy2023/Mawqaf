import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import communityReducer from "./slices/communitySlice";
import stationsReducer from "./slices/Transportation/stationsSlice";
import nearStationsReducer from "./slices/Transportation/getNearStations";
import linesReducer from "./slices/Transportation/linesSlice";
import vichelsReducer from "./slices/Transportation/vichelsSlice";
import stationDetailsReducer from "./slices/Transportation/stationDetailsSlice";
import userBookingReducer from "./slices/Transportation/userBookingSlice";

import profileReducer from "./slices/profileSlice";
import cartReducer from "./slices/MarketPlace/cartSlice";
import reviewsReducer from "./slices/MarketPlace/reviewsSlice";
import ordersReducer from "./slices/MarketPlace/ordersSlice";

import managerReducer from "./slices/managerSlice";
import adminReducer from "./slices/adminSlice";
import chatReducer from "./slices/chatSlice";

// import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    stations: stationsReducer,
    stationDetails: stationDetailsReducer,
    nearStations: nearStationsReducer,
    lines: linesReducer,
    vichels: vichelsReducer,
    userBooking: userBookingReducer,

    profile: profileReducer,
    cart: cartReducer,
    reviews: reviewsReducer,
    orders: ordersReducer,
    chat: chatReducer,

    manager: managerReducer,
    admin: adminReducer,
  },
});

export default store;
