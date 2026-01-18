import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../API/axios";


// Async thunk عشان نجيب محطة بالـ ID
export const fetchStationById = createAsyncThunk(
  "stationDetails/fetchById",
  async (stationId, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/station/${stationId}`
      );
      return res.data.data; // حسب شكل الـ response عندك
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const stationDetailsSlice = createSlice({
  name: "stationDetails",
  initialState: {
    station: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearStation: (state) => {
      state.station = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationById.fulfilled, (state, action) => {
        state.station = action.payload;
        state.loading = false;
      })
      .addCase(fetchStationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { clearStation } = stationDetailsSlice.actions;
export default stationDetailsSlice.reducer;
