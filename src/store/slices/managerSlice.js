import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";
import toast from "react-hot-toast";

// Thunks
export const fetchManagerStats = createAsyncThunk(
  "manager/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/manager/community/stats");
      // Adjust based on actual API response structure (data or data.data)
      return res.data?.data || res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const fetchStations = createAsyncThunk(
  "manager/fetchStations",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/station?page=${page}&limit=${limit}&search=${search}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stations"
      );
    }
  }
);

export const fetchCommunityData = createAsyncThunk(
  "manager/fetchCommunityData",
  async (
    { type = "posts", subTab = "all", page = 1, category = "" },
    { rejectWithValue }
  ) => {
    try {
      let endpoint = "/manager/community";
      if (type === "posts") {
        endpoint += `/posts?page=${page}&limit=10`;
        if (subTab === "hidden") endpoint += "&status=HIDDEN";
        if (subTab === "deleted") endpoint += "&status=DELETED";
        if (category) endpoint += `&category=${category}`;
      } else if (type === "reports") {
        endpoint += "/reports";
      }
      const res = await API.get(endpoint);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data"
      );
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "manager/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth?role=ADMIN&limit=100");
      return res.data.data?.users || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin users"
      );
    }
  }
);

export const createUserAccount = createAsyncThunk(
  "manager/createUserAccount",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/register", userData);
      return res.data.data?.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user account"
      );
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  "manager/verifyUserEmail",
  async ({ verificationCode }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/verify-email", { verificationCode });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid verification code"
      );
    }
  }
);

// Slice
const managerSlice = createSlice({
  name: "manager",
  initialState: {
    stats: {
      totalUsers: 0,
      activeStations: 0,
      totalPosts: 0,
      pendingReports: 0,
    },
    stations: {
      data: [],
      totalPages: 1,
      currentPage: 1,
      loading: false,
    },
    community: {
      data: [],
      totalPages: 1,
      currentPage: 1,
      totalCount: 0,
      loading: false,
    },
    adminUsers: [],
    loadingAdmins: false,
    error: null,
    loading: false, // Global loading for stats
  },
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchManagerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchManagerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Stations
    builder
      .addCase(fetchStations.pending, (state) => {
        state.stations.loading = true;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stations.loading = false;
        state.stations.data = action.payload.data || [];
        state.stations.totalPages = action.payload.lastPage || 1;
        state.stations.currentPage = action.payload.page || 1;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.stations.loading = false;
        toast.error(action.payload);
      });

    // Community
    builder
      .addCase(fetchCommunityData.pending, (state) => {
        state.community.loading = true;
      })
      .addCase(fetchCommunityData.fulfilled, (state, action) => {
        state.community.loading = false;

        // Handle both paginated response for posts and array response for reports
        if (action.payload.data && Array.isArray(action.payload.data)) {
          const { data, lastPage, page, totalCount } = action.payload;
          if (page > 1) {
            state.community.data = [...state.community.data, ...data];
          } else {
            state.community.data = data;
          }
          state.community.totalPages = lastPage || 1;
          state.community.currentPage = page || 1;
          state.community.totalCount = totalCount || 0;
        } else if (Array.isArray(action.payload)) {
          // Fallback for direct reports/comments arrays
          state.community.data = action.payload;
          state.community.totalPages = 1;
          state.community.currentPage = 1;
        }
      })
      .addCase(fetchCommunityData.rejected, (state, action) => {
        state.community.loading = false;
        // Optional: toast.error(action.payload);
      });

    // Admin Users
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loadingAdmins = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loadingAdmins = false;
        state.adminUsers = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state) => {
        state.loadingAdmins = false;
      });

    // Create User Account
    builder
      .addCase(createUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Don't show toast here, will show after verification
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Verify User Email
    builder
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default managerSlice.reducer;
