import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPostsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPostsSuccess: (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.posts;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    getPostsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
      state.error = null;
    },
    createPostFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    clearPostError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getPostsRequest,
  getPostsSuccess,
  getPostsFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  clearPosts,
  clearPostError,
} = postSlice.actions;

export default postSlice.reducer;