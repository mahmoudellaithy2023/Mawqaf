// store/slices/linesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../API/axios";


export const fetchLineById = createAsyncThunk(
  "lines/fetchLineById",
  async ({ stationId, lineId }, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/station/${stationId}/lines/${lineId}`
      );
      return res.data.data; // لاحظ إن البيانات موجودة تحت data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء جلب بيانات الخط"
      );
    }
  }
);

const linesSlice = createSlice({
  name: "lines",
  initialState: {
    line: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLine: (state) => {
      state.line = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLineById.fulfilled, (state, action) => {
        state.loading = false;
        state.line = action.payload;
      })
      .addCase(fetchLineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLine } = linesSlice.actions;
export default linesSlice.reducer;
