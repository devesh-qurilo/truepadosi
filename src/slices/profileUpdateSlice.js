import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  profileUpdated: false,
  profileData: null,
};

const profileUpdateSlice = createSlice({
  name: 'profileUpdate',
  initialState,
  reducers: {
    // Update profile actions
    updateProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.profileUpdated = false;
    },
    updateProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload;
      state.profileUpdated = true;
      state.error = null;
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.profileUpdated = false;
      state.error = action.payload;
    },

    // Clear profile update state
    clearProfileUpdateState: (state) => {
      state.profileData = null;
      state.profileUpdated = false;
      state.error = null;
    },

    // Clear error
    clearProfileUpdateError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfileUpdateState,
  clearProfileUpdateError,
} = profileUpdateSlice.actions;

export default profileUpdateSlice.reducer;

// Selectors
export const selectProfileUpdateLoading = (state) => state.profileUpdate.isLoading;
export const selectProfileUpdateError = (state) => state.profileUpdate.error;
export const selectProfileUpdated = (state) => state.profileUpdate.profileUpdated;