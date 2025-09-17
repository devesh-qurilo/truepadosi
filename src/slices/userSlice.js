import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProfile: null,
  isLoading: false,
  error: null,
  usersList: [],
  currentPage: 1,
  totalPages: 1,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUserProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
      state.error = null;
    },
    getUserProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.usersList = action.payload.users;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    getUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getUserProfileRequest,
  getUserProfileSuccess,
  getUserProfileFailure,
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  clearUserProfile,
  clearUserError,
} = userSlice.actions;

export default userSlice.reducer;