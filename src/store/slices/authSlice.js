import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import API from "../../API/axios";

/* ===================== LOGIN ===================== */
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", userData);

      const token = res.data?.data?.accessToken;
      if (!token) throw new Error("Token not found");

      localStorage.setItem("user", JSON.stringify({ token }));
      return token;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ===================== REGISTER ===================== */
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      await API.post("/auth/register", userData);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);

/* ===================== VERIFY EMAIL ===================== */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationCode, thunkAPI) => {
    try {
      const res = await API.post("/auth/verify-email", {
        verificationCode,
      });

      const token = res.data?.data?.accessToken;
      if (!token) throw new Error("Token not found");

      localStorage.setItem("user", JSON.stringify({ token }));
      return token;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Verification failed"
      );
    }
  }
);

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      await API.post("/auth/send-verification-password", { email });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send code"
      );
    }
  }
);

/* ===================== VERIFY RESET CODE ===================== */
export const verifyPasswordCode = createAsyncThunk(
  "auth/verifyPasswordCode",
  async (verificationCode, thunkAPI) => {
    try {
      const res = await API.post("/auth/verify-password", {
        verificationCode,
      });

      return res.data?.data?.resetToken;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Invalid code"
      );
    }
  }
);

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmPassword }, thunkAPI) => {
    try {
      await API.post(`/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Reset failed"
      );
    }
  }
);

/* ===================== LOGOUT ===================== */
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await API.post("/auth/logout");
  } catch (e) {
    console.log("Logout API failed:", e.message);
  }
  localStorage.removeItem("mowqif_app_intro_shown");
  localStorage.removeItem("cart");
  localStorage.removeItem("ai-chat");
  localStorage.removeItem("user");
  localStorage.removeItem("introShown");
});

/* ===================== GET USER ===================== */
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/auth/me");
      return res.data?.data || res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load user");
    }
  }
);

/* ===================== INITIAL STATE ===================== */
const getInitialAuthState = () => {
  const stored = JSON.parse(localStorage.getItem("user"));

  if (stored?.token) {
    const decoded = jwtDecode(stored.token);

    return {
      isAuthenticated: true,
      user: {
        id: decoded.id || decoded._id || decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  }

  return {
    isAuthenticated: false,
    user: null,
  };
};

const initialState = {
  ...getInitialAuthState(),
  message: "",
  resetToken: null,
  pendingVerificationEmail: null,

  register: { isLoading: false, isSuccess: false, isError: false, message: "" },
  login: { isLoading: false, isError: false, isSuccess: false, message: "" },
  forgotPassword: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  verifyCode: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    resetToken: null,
  },
  resetPassword: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
};

/* ===================== SLICE ===================== */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.login = {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
      };
    },
    setPendingVerificationEmail: (state, action) => {
      state.pendingVerificationEmail = action.payload;
    },
    clearResetToken: (state) => {
      state.resetToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.isError = false;
        state.login.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false;
        state.login.isSuccess = true;
        state.isAuthenticated = true;

        const decoded = jwtDecode(action.payload);
        state.user = {
          id: decoded.id || decoded._id || decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.isError = true;
        state.login.message = action.payload;
      })

      /* REGISTER */
      .addCase(register.pending, (state) => {
        state.register.isLoading = true;
        state.register.isError = false;
        state.register.isSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.register.isLoading = false;
        state.register.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.isLoading = false;
        state.register.isError = true;
        state.register.message = action.payload;
      })

      /* VERIFY EMAIL */
      .addCase(verifyEmail.pending, (state) => {
        state.login.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.login.isLoading = false;
        state.isAuthenticated = true;

        const decoded = jwtDecode(action.payload);
        state.user = {
          id: decoded.id || decoded._id || decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.isError = true;
        state.login.message = action.payload;
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPassword.isLoading = false;
        state.forgotPassword.isSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.isLoading = false;
        state.forgotPassword.isError = true;
        state.forgotPassword.message = action.payload;
      })

      /* VERIFY RESET CODE */
      .addCase(verifyPasswordCode.pending, (state) => {
        state.verifyCode.isLoading = true;
      })
      .addCase(verifyPasswordCode.fulfilled, (state, action) => {
        state.verifyCode.isLoading = false;
        state.verifyCode.isSuccess = true;
        state.resetToken = action.payload;
      })
      .addCase(verifyPasswordCode.rejected, (state, action) => {
        state.verifyCode.isLoading = false;
        state.verifyCode.isError = true;
        state.verifyCode.message = action.payload;
      })

      /* RESET PASSWORD */
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.isLoading = false;
        state.resetPassword.isSuccess = true;
        state.resetToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.isLoading = false;
        state.resetPassword.isError = true;
        state.resetPassword.message = action.payload;
      })

      /* LOGOUT */
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.login = {
          isLoading: false,
          isError: false,
          isSuccess: false,
          message: "",
        };
      })

      /* GET USER */
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { resetAuthState, setPendingVerificationEmail, clearResetToken } =
  authSlice.actions;

export default authSlice.reducer;
