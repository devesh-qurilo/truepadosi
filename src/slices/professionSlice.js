import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  professionSubmitted: false,
  professionData: null,
};

const professionSlice = createSlice({
  name: 'profession',
  initialState,
  reducers: {
    // Submit profession actions
    submitProfessionRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.professionSubmitted = false;
    },
    submitProfessionSuccess: (state, action) => {
      state.isLoading = false;
      state.professionData = action.payload;
      state.professionSubmitted = true;
      state.error = null;
    },
    submitProfessionFailure: (state, action) => {
      state.isLoading = false;
      state.professionSubmitted = false;
      state.error = action.payload;
    },

    // Clear profession state
    clearProfessionState: (state) => {
      state.professionData = null;
      state.professionSubmitted = false;
      state.error = null;
    },

    // Clear error
    clearProfessionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  submitProfessionRequest,
  submitProfessionSuccess,
  submitProfessionFailure,
  clearProfessionState,
  clearProfessionError,
} = professionSlice.actions;

export default professionSlice.reducer;

// Selectors
export const selectProfessionLoading = (state) => state.profession.isLoading;
export const selectProfessionError = (state) => state.profession.error;
export const selectProfessionSubmitted = (state) => state.profession.professionSubmitted;