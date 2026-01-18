import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios"; // هنا بنجيب الـ axios instance

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, thunkAPI) => {
    try {
      const res = await API.get(`/auth/user/${id}`);
      return res.data; // بيانات المستخدم كاملة
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
    isFollowing: false,
  },
  reducers: {
    toggleFollow: (state) => {
      state.isFollowing = !state.isFollowing;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { toggleFollow } = profileSlice.actions;
export default profileSlice.reducer;
