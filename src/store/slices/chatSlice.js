import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";

/* ======================================================
   Conversations
====================================================== */
export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ senderId, receiverId }, thunkAPI) => {
    try {
      const res = await API.post("/conversations", {
        senderId,
        receiverId,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Create conversation failed"
      );
    }
  }
);

export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (userId, thunkAPI) => {
    try {
      const res = await API.get(`/conversations/${userId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get conversations failed"
      );
    }
  }
);

/* ======================================================
   Messages
====================================================== */
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (conversationId, thunkAPI) => {
    try {
      const res = await API.get(`/messages/${conversationId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get messages failed"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, senderId, text, replyTo }, thunkAPI) => {
    try {
      const res = await API.post("/messages", {
        conversationId,
        senderId,
        text,
        replyTo,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Send message failed"
      );
    }
  }
);

/* ======================================================
   Slice
====================================================== */
const initialState = {
  conversations: [],
  messages: [],

  loading: {
    conversations: false,
    messages: false,
    sendMessage: false,
    createConversation: false,
  },

  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      // Prevent duplicates
      const exists = state.messages.find(
        (m) => m._id === action.payload._id || m.id === action.payload._id
      );
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== Create Conversation ===== */
      .addCase(createConversation.pending, (state) => {
        state.loading.createConversation = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading.createConversation = false;
        state.conversations.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading.createConversation = false;
        state.error = action.payload;
      })

      /* ===== Get Conversations ===== */
      .addCase(getConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error = action.payload;
      })

      /* ===== Get Messages ===== */
      .addCase(getMessages.pending, (state) => {
        state.loading.messages = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.payload;
      })

      /* ===== Send Message ===== */
      .addCase(sendMessage.pending, (state) => {
        state.loading.sendMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sendMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sendMessage = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, clearError, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
