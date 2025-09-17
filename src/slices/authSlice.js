// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,
//   isOtpSent: false,
//   isOtpVerified: false,
//   error: null,
//   otpData: null, // Store email/phone for registration after OTP verification
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     // OTP Actions
//     sendOtpRequest: (state, action) => {
//       state.isLoading = true;
//       state.error = null;
//     },
//     sendOtpSuccess: (state, action) => {
//       state.isLoading = false;
//       state.isOtpSent = true;
//       state.otpData = action.payload; // Store email/phone for later use
//       state.error = null;
//     },
//     sendOtpFailure: (state, action) => {
//       state.isLoading = false;
//       state.isOtpSent = false;
//       state.error = action.payload;
//     },

//     // Registration Actions
//     registerRequest: (state, action) => {
//       state.isLoading = true;
//       state.error = null;
//     },
//     registerSuccess: (state, action) => {
//       state.isLoading = false;
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isOtpSent = false;
//       state.isOtpVerified = false;
//       state.otpData = null;
//       state.error = null;
//     },
//     registerFailure: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },

//     // Clear states
//     clearOtpState: (state) => {
//       state.isOtpSent = false;
//       state.isOtpVerified = false;
//       state.otpData = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
// });

// export const {
//   sendOtpRequest,
//   sendOtpSuccess,
//   sendOtpFailure,
//   registerRequest,
//   registerSuccess,
//   registerFailure,
//   clearOtpState,
//   clearError,
// } = authSlice.actions;

// export default authSlice.reducer;




import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpDetailsId: null,
  isOtpSent: false,
  registrationSuccess: false, // Add this flag
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // OTP Actions
   sendOtpRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.isOtpSent = false;
    },
    sendOtpSuccess: (state, action) => {
  state.isLoading = false;
  state.otpDetailsId = action.payload.otpDetailsId;
  state.isOtpSent = true;    // Should be isOtpSent, not otpSent
  state.error = null;
},
    sendOtpFailure: (state, action) => {
      state.isLoading = false;
      state.isOtpSent = false;
      state.error = action.payload;
    },

    // Registration Actions (updated for OTP)
    registerRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
   registerSuccess: (state, action) => {
  state.isLoading = false;
  state.isAuthenticated = true;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.otpDetailsId = null;
  state.isOtpSent = false;
  state.registrationSuccess = true; // Set success flag
  state.error = null;
},
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear OTP state
    clearOtpState: (state) => {
      state.otpDetailsId = null;
      state.isOtpSent = false;
    },

    // ... other existing actions (login, logout, etc.)
    loginRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.otpDetailsId = null;
      state.isOtpSent = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
  },
});

export const {
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  clearOtpState,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearError,
  setAuthState,
} = authSlice.actions;

export default authSlice.reducer;