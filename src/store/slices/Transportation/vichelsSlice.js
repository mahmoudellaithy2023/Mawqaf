import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLineVichels = createAsyncThunk(
  "vichels/fetchLineVichels",
  async ({ stationId, lineId }, thunkAPI) => {
    try {
      const res = await axios.get(
        `https://auth-api-4-h4v4.onrender.com/api/station/${stationId}/lines/${lineId}/vichels`
      );

      //  رجّع object فيه count + results
      return {
        count: res.data.count,
        results: res.data.results,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "فشل تحميل العربيات"
      );
    }
  }
);

const vichelsSlice = createSlice({
  name: "vichels",
  initialState: {
    results: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearVichels: (state) => {
      state.results = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLineVichels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLineVichels.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchLineVichels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVichels } = vichelsSlice.actions;
export default vichelsSlice.reducer;
