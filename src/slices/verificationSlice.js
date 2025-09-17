import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  verificationSubmitted: false,
  verificationData: null, // This can include address, postal card option, and optional document
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    // Submit verification actions
    submitVerificationRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.verificationSubmitted = false;
    },
    submitVerificationSuccess: (state, action) => {
      state.isLoading = false;
      state.verificationData = {
        ...action.payload,
        // explicitly ensure document can be null if not uploaded
        document: action.payload.document ?? null,
      };
      state.verificationSubmitted = true;
      state.error = null;
    },
    submitVerificationFailure: (state, action) => {
      state.isLoading = false;
      state.verificationSubmitted = false;
      state.error = action.payload;
    },

    // Clear verification state
    clearVerificationState: (state) => {
      state.verificationData = null;
      state.verificationSubmitted = false;
      state.error = null;
    },

    // Clear error
    clearVerificationError: (state) => {
      state.error = null;
    },
  },
});

export const {
  submitVerificationRequest,
  submitVerificationSuccess,
  submitVerificationFailure,
  clearVerificationState,
  clearVerificationError,
} = verificationSlice.actions;

export default verificationSlice.reducer;

// Selectors
export const selectVerificationLoading = (state) => state.verification.isLoading;
export const selectVerificationError = (state) => state.verification.error;
export const selectVerificationSubmitted = (state) => state.verification.verificationSubmitted;
