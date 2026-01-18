import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../API/axios";

export const fetchStations = createAsyncThunk(
  "stations/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/station", {
        params: {
          limit: 200,
        },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

const stationsSlice = createSlice({
  name: "stations",
  initialState: {
    stations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stationsSlice.reducer;
