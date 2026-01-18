import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";
import toast from "react-hot-toast";

export const fetchAdminStationDetails = createAsyncThunk(
  "admin/fetchStationDetails",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;

      if (!userId) return rejectWithValue("User not authenticated");

      // Fetch all stations (using high limit to avoid pagination issues)
      const res = await API.get("/station?limit=1000");
      const allStations = res.data?.data || [];

      const myStation = allStations.find((s) => s.admin === userId);

      if (!myStation) {
        return rejectWithValue("No station assigned to this admin");
      }

      return myStation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch station details"
      );
    }
  }
);

export const fetchStationStats = createAsyncThunk(
  "admin/fetchStationStats",
  async (stationId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/station/${stationId}/stats`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch station stats"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    station: null,
    stats: {
      activeVehicles: 0,
      todayPassengers: 0,
      todayTrips: 0,
    },
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.station = action.payload;
      })
      .addCase(fetchAdminStationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stats
      .addCase(fetchStationStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStationStats.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});

export default adminSlice.reducer;
