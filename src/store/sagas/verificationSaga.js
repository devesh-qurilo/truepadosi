import { call, put, takeLatest } from 'redux-saga/effects';
import { verificationService } from '../../services/verificationService';
import {
  submitVerificationFailure,
  submitVerificationRequest,
  submitVerificationSuccess,
} from '../../slices/verificationSlice';

// Submit verification saga
function* submitVerificationSaga(action) {
  try {
    const response = yield call(verificationService.submitVerification, action.payload);
    
    if (response.success) {
      yield put(submitVerificationSuccess(response));
      // Note: The response structure shows userDetails, not data
    } else {
      yield put(submitVerificationFailure(response.message || 'Failed to submit verification'));
    }
  } catch (error) {
    console.error('Verification saga error:', error);
    yield put(submitVerificationFailure(error.message || 'Failed to submit verification'));
  }
}

// Watcher saga
export function* watchVerification() {
  yield takeLatest(submitVerificationRequest.type, submitVerificationSaga);
}