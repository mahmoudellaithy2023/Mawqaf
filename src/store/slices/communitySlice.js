import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";

// =======================
// Thunks
// =======================
// export const getPosts = createAsyncThunk(
//   'community/getPosts',
//   async (category, thunkAPI) => {
//     try {
//       const query = category && category !== 'ALL' ? `?category=${category}` : '';
//       const res = await API.get(`/community/posts${query}`);
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || 'Failed to get posts');
//     }
//   }
// );

export const getPosts = createAsyncThunk(
  "community/getPosts",
  async ({ category = "ALL", page = 1 }, thunkAPI) => {
    try {
      const query =
        category !== "ALL"
          ? `?category=${category}&page=${page}`
          : `?page=${page}`;

      const res = await API.get(`/community/posts${query}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to get posts"
      );
    }
  }
);

// export const getPostsByUser = createAsyncThunk(
//   "community/getPostsByUser",
//   async (userId, thunkAPI) => {
//     try {
//       const res = await API.get(`/community/users/${userId}/posts`);
//       return res.data; // مصفوفة البوستات
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || "Failed to get user posts");
//     }
//   }
// );

export const getPostsByUser = createAsyncThunk(
  "community/getPostsByUser",
  async ({ userId, page = 1 }, thunkAPI) => {
    try {
      const res = await API.get(
        `/community/users/${userId}/posts?page=${page}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to get user posts"
      );
    }
  }
);

/* ===================== Get user posts ===================== */
export const createPost = createAsyncThunk(
  "community/createPost",
  async (postData, thunkAPI) => {
    try {
      const res = await API.post("/community/posts", postData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "community/deletePost",
  async (postId, thunkAPI) => {
    try {
      await API.delete(`/community/posts/${postId}`);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "community/updatePost",
  async ({ postId, updateData }, thunkAPI) => {
    try {
      const res = await API.put(`/community/posts/${postId}`, updateData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "community/likePost",
  async (postId, thunkAPI) => {
    try {
      const res = await API.post(`/community/posts/${postId}/like`);
      return {
        postId,
        likesCount: res.data.likesCount,
        isLiked: res.data.isLiked,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to like post"
      );
    }
  }
);
export const addComment = createAsyncThunk(
  "community/addComment",
  async ({ postId, content }, thunkAPI) => {
    try {
      const res = await API.post(`/community/posts/${postId}/comments`, {
        content,
      });
      return { postId, comment: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "community/updateComment",
  async ({ commentId, content }, thunkAPI) => {
    try {
      const res = await API.put(`/community/comments/${commentId}`, {
        content,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

export const getActivity = createAsyncThunk(
  "community/getActivity",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/community/activity");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to get activity"
      );
    }
  }
);

// =======================
// Slice
// =======================
const communitySlice = createSlice({
  name: "community",
  initialState: {
    posts: [],
    userPosts: [],
    page: 1,
    lastPage: 1,
    userPostsPage: 1,
    userPostsLastPage: 1,
    activity: [],
    isLoadingPosts: false,
    isCreatingPost: false,
    isUpdatingPost: false,
    isAddingComment: false,
    isUpdatingComment: false,
    isLikingPost: false,
    isActivityLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetCommunity: (state) => {
      state.posts = [];
      state.page = 1;
      state.lastPage = 1;
      state.isError = false;
      state.message = "";
    },
    resetUserPosts: (state) => {
      // ← أضف هذا
      state.userPosts = [];
      state.userPostsPage = 1;
      state.userPostsLastPage = 1;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ================== Get Posts ==================
      .addCase(getPosts.pending, (state) => {
        state.isLoadingPosts = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoadingPosts = false;

        const processedPosts = (action.payload.data || []).map((post) => ({
          ...post,
          likesCount: Math.max(0, post.likesCount || 0),
        }));

        if (action.payload.page === 1) {
          state.posts = processedPosts;
        } else {
          state.posts.push(...processedPosts);
        }

        state.page = action.payload.page;
        state.lastPage = action.payload.lastPage;
      })

      .addCase(getPosts.rejected, (state, action) => {
        state.isLoadingPosts = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Get Posts By User ==================
      .addCase(getPostsByUser.pending, (state) => {
        state.isLoadingPosts = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getPostsByUser.fulfilled, (state, action) => {
        state.isLoadingPosts = false;

        const posts = action.payload.data || action.payload.posts || [];
        const processedPosts = posts.map((post) => ({
          ...post,
          likesCount: Math.max(0, post.likesCount || 0),
        }));

        if (action.payload.page === 1) {
          state.userPosts = processedPosts;
        } else {
          state.userPosts.push(...processedPosts);
        }

        state.userPostsPage = action.payload.page || 1;
        state.userPostsLastPage = action.payload.lastPage || 1;
      })

      .addCase(getPostsByUser.rejected, (state, action) => {
        state.isLoadingPosts = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Create Post ==================
      .addCase(createPost.pending, (state) => {
        state.isCreatingPost = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreatingPost = false;
        const newPost = {
          ...action.payload,
          likesCount: Math.max(0, action.payload.likesCount || 0),
        };
        state.posts.unshift(newPost);
        // Sync with userPosts if they exist
        if (state.userPosts && state.userPosts.length > 0) {
          state.userPosts.unshift(newPost);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreatingPost = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Update Post ==================
      .addCase(updatePost.pending, (state) => {
        state.isUpdatingPost = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdatingPost = false;
        const updatedPosts = new Set();

        const updateArray = (array) => {
          const index = array.findIndex((p) => p._id === action.payload._id);
          if (index !== -1) {
            const existingPost = array[index];
            if (updatedPosts.has(existingPost)) return;

            const incomingPost = action.payload;
            let userToUse = incomingPost.user;
            if (!userToUse || typeof userToUse === "string") {
              userToUse = existingPost.user;
            }

            array[index] = {
              ...existingPost,
              ...incomingPost,
              user: userToUse,
              likesCount: Math.max(
                0,
                incomingPost.likesCount ?? existingPost.likesCount ?? 0
              ),
            };
            updatedPosts.add(array[index]);
          }
        };
        updateArray(state.posts);
        updateArray(state.userPosts);
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdatingPost = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Delete Post ==================
      .addCase(deletePost.pending, (state) => {
        state.isUpdatingPost = true; // reusing existing loading state or can add isDeleting
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isUpdatingPost = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.userPosts = state.userPosts.filter(
          (post) => post._id !== action.payload
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isUpdatingPost = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Like Post ==================
      .addCase(likePost.pending, (state) => {
        state.isLikingPost = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLikingPost = false;
        const safeLikesCount = Math.max(0, action.payload.likesCount || 0);
        const updatedPosts = new Set();

        const updateLike = (array) => {
          const post = array.find((p) => p._id === action.payload.postId);
          if (post && !updatedPosts.has(post)) {
            post.likesCount = safeLikesCount;
            post.isLiked = action.payload.isLiked ?? !post.isLiked;
            updatedPosts.add(post);
          }
        };

        updateLike(state.posts);
        updateLike(state.userPosts);
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLikingPost = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Add Comment ==================
      .addCase(addComment.pending, (state) => {
        state.isAddingComment = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isAddingComment = false;
        const updatedPosts = new Set();

        const updateCommentCount = (array) => {
          const post = array.find((p) => p._id === action.payload.postId);
          if (post && !updatedPosts.has(post)) {
            post.comments = post.comments || [];
            post.comments.push(action.payload.comment);
            post.commentsCount = (post.commentsCount || 0) + 1;
            updatedPosts.add(post);
          }
        };

        updateCommentCount(state.posts);
        updateCommentCount(state.userPosts);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isAddingComment = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Update Comment ==================
      .addCase(updateComment.pending, (state) => {
        state.isUpdatingComment = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isUpdatingComment = false;

        const syncCommentUpdate = (array) => {
          return array.map((post) => {
            if (!post.comments) return post;
            return {
              ...post,
              comments: post.comments.map((c) =>
                c._id === action.payload._id
                  ? { ...c, content: action.payload.content }
                  : c
              ),
            };
          });
        };

        state.posts = syncCommentUpdate(state.posts);
        state.userPosts = syncCommentUpdate(state.userPosts);
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isUpdatingComment = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================== Activity ==================
      .addCase(getActivity.pending, (state) => {
        state.isActivityLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.activity = action.payload;
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.isActivityLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCommunity, resetUserPosts } = communitySlice.actions;
export default communitySlice.reducer;
