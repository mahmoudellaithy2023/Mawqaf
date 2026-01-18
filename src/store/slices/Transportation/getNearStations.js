import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../API/axios";

// Async thunk
export const fetchNearStations = createAsyncThunk(
  "nearStations/fetch",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const res = await API.get("/station/near", {
        params: {
          lat,
          lng,
          distance: 10000,
        },
      });

      return res.data.data; // array of stations
    } catch (err) {
      return rejectWithValue(err.response?.data || "فشل تحميل أقرب المحطات");
    }
  }
);

const nearStationsSlice = createSlice({
  name: "nearStations",
  initialState: {
    stations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNearStations: (state) => {
      state.stations = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchNearStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { clearNearStations } = nearStationsSlice.actions;
export default nearStationsSlice.reducer;
