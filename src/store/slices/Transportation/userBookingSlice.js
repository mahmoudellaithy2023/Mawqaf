import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../API/axios";

/* ======================================================
   Book Seat (Pending)
====================================================== */
export const bookSeat = createAsyncThunk(
  "userBooking/bookSeat",
  async ({ stationId, lineId, vichelId }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `/station/${stationId}/lines/${lineId}/vichels/${vichelId}/book`
      );

      return {
        booking: res.data.data,
        vichelId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "فشل حجز المقعد");
    }
  }
);

/* ======================================================
   Confirm Booking (Pending → Active)
====================================================== */
export const confirmBooking = createAsyncThunk(
  "userBooking/confirmBooking",
  async ({ stationId, lineId, vichelId, bookingId }, { rejectWithValue }) => {
    try {
      await API.post(
        `/station/${stationId}/lines/${lineId}/vichels/${vichelId}/book/${bookingId}/confirm`
      );
      return { vichelId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "فشل تأكيد الحجز");
    }
  }
);

/* ======================================================
   Cancel Booking
====================================================== */
export const cancelBooking = createAsyncThunk(
  "userBooking/cancelBooking",
  async ({ stationId, lineId, vichelId }, { rejectWithValue }) => {
    try {
      await API.delete(
        `/station/${stationId}/lines/${lineId}/vichels/${vichelId}/book`
      );
      return vichelId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "فشل إلغاء الحجز");
    }
  }
);

/* ======================================================
   Get User Booking History
====================================================== */
export const getUserBookingHistory = createAsyncThunk(
  "userBooking/getUserBookingHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/history");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "فشل تحميل سجل الحجوزات"
      );
    }
  }
);

/* ======================================================
   Initial State
====================================================== */
const initialState = {
  hasBooking: false,
  bookingStatus: null, // pending | active
  bookedVehicleId: null,
  bookingData: null,

  // History state
  history: [],
  isLoadingHistory: false,
  historyError: null,

  loading: false,
  loadingVehicleId: null,

  error: null,
  successMessage: null,
};

/* ======================================================
   Slice
====================================================== */
const userBookingSlice = createSlice({
  name: "userBooking",
  initialState,

  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    resetBookingState: () => initialState,

    syncBooking: (state, action) => {
      const { vehicle, userId } = action.payload;
      // Find the user's booking in the vehicle's bookedUsers
      const userBooking = vehicle.bookedUsers?.find(
        (u) => u._id === userId || u.id === userId
      );

      if (userBooking) {
        state.hasBooking = true;
        state.bookingStatus = userBooking.bookingStatus || "active";
        state.bookedVehicleId = vehicle._id;
        state.bookingData = {
          _id: userBooking.bookingId,
          status: userBooking.bookingStatus,
          expiresAt:
            userBooking.expiresAt ||
            (userBooking.bookedAt
              ? new Date(
                  new Date(userBooking.bookedAt).getTime() + 10 * 60 * 1000
                ).toISOString()
              : null),
          vehicle: vehicle,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* ========================= HISTORY ========================= */
      .addCase(getUserBookingHistory.pending, (state) => {
        state.isLoadingHistory = true;
        state.historyError = null;
      })
      .addCase(getUserBookingHistory.fulfilled, (state, action) => {
        state.isLoadingHistory = false;
        state.history = action.payload.data;
      })
      .addCase(getUserBookingHistory.rejected, (state, action) => {
        state.isLoadingHistory = false;
        state.historyError = action.payload;
      })

      /* ========================= BOOK ========================= */
      .addCase(bookSeat.pending, (state, action) => {
        state.loading = true;
        state.loadingVehicleId = action.meta.arg.vichelId;
        state.error = null;
      })
      .addCase(bookSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingVehicleId = null;

        state.hasBooking = true;
        state.bookingStatus = "pending";
        state.bookedVehicleId = action.payload.vichelId;
        state.bookingData = action.payload.booking;

        state.successMessage = "تم حجز المقعد مؤقتًا، يرجى التأكيد";
      })
      .addCase(bookSeat.rejected, (state, action) => {
        state.loading = false;
        state.loadingVehicleId = null;
        state.error = action.payload;
      })

      /* ========================= CONFIRM ========================= */
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.loadingVehicleId = state.bookedVehicleId;
        state.error = null;
      })

      .addCase(confirmBooking.fulfilled, (state) => {
        state.loading = false;
        state.loadingVehicleId = null;

        if (state.bookingData) {
          state.bookingStatus = "active";
          state.bookingData.status = "active";
        }

        state.successMessage = "تم تأكيد الحجز بنجاح";
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========================= CANCEL ========================= */
      .addCase(cancelBooking.pending, (state, action) => {
        state.loading = true;
        state.loadingVehicleId = action.meta.arg.vichelId;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state) => {
        state.loading = false;
        state.loadingVehicleId = null;

        state.hasBooking = false;
        state.bookingStatus = null;
        state.bookedVehicleId = null;
        state.bookingData = null;

        state.successMessage = "تم إلغاء الحجز بنجاح";
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.loadingVehicleId = null;
        state.error = action.payload;
      });
  },
});

/* ======================================================
   Exports
====================================================== */
export const { clearBookingMessages, resetBookingState, syncBooking } =
  userBookingSlice.actions;

export default userBookingSlice.reducer;
