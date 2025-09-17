
import { call, put, takeLatest } from 'redux-saga/effects';
import { authService } from '../../services/authService';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutFailure,
  logoutRequest,
  logoutSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
  sendOtpFailure,
  sendOtpRequest,
  sendOtpSuccess,
} from '../../slices/authSlice';

// Send OTP saga - add debug logs
function* sendOtpSaga(action) {
  try {
    console.log('Sending OTP with:', action.payload);
    const { phoneNumber, email } = action.payload;


    console.log("phoneNumber, email", phoneNumber, email);
    const response = yield call(authService.sendOtp, phoneNumber, email);
    
    console.log('OTP API response:', response);
    
    if (response.success) {
      console.log('OTP sent successfully, dispatching success');
      yield put(sendOtpSuccess({
        otpDetailsId: response.Details,
      }));
    } else {
      console.log('OTP failed:', response.message);
      yield put(sendOtpFailure(response.message || 'Failed to send OTP'));
    }
  } catch (error) {
    console.log('OTP error sendOtpSaga:', error.message);
    let errorMessage = error.message || 'Failed to send OTP';
    
    if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
      errorMessage = 'Server error: Invalid response format. Please try again.';
    }
    
    yield put(sendOtpFailure(errorMessage));
  }
}

// Register saga (with OTP verification)
function* registerSaga(action) {
  try {
    const response = yield call(authService.register, action.payload);
    
    if (response.success) {
      yield put(registerSuccess({
        user: response.user,
        token: response.token,
      }));
    } else {
      yield put(registerFailure(response.message || 'Registration failed'));
    }
  } catch (error) {
    yield put(registerFailure(error.message || 'Registration failed'));
  }
}

// Login saga
function* loginSaga(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authService.login, email, password);
    
    if (response.success) {
      yield put(loginSuccess({
        user: response.user,
        token: response.token,
      }));
    } else {
      yield put(loginFailure(response.message));
    }
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

// Logout saga
function* logoutSaga() {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.message));
  }
}

export function* watchAuth() {
  yield takeLatest(sendOtpRequest.type, sendOtpSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}