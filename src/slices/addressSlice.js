import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  isLoading: false,
  error: null,
  addressSubmitted: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Submit address actions
    submitAddressRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.addressSubmitted = false;
    },
    submitAddressSuccess: (state, action) => {
      state.isLoading = false;
      state.address = action.payload;
      state.addressSubmitted = true;
      state.error = null;
    },
    submitAddressFailure: (state, action) => {
      state.isLoading = false;
      state.addressSubmitted = false;
      state.error = action.payload;
    },

    // Clear address state
    clearAddressState: (state) => {
      state.address = null;
      state.addressSubmitted = false;
      state.error = null;
    },

    // Clear error
    clearAddressError: (state) => {
      state.error = null;
    },
  },
});

export const {
  submitAddressRequest,
  submitAddressSuccess,
  submitAddressFailure,
  clearAddressState,
  clearAddressError,
} = addressSlice.actions;

export default addressSlice.reducer;

// Selectors
export const selectAddress = (state) => state.address.address;
export const selectAddressLoading = (state) => state.address.isLoading;
export const selectAddressError = (state) => state.address.error;
export const selectAddressSubmitted = (state) => state.address.addressSubmitted;


