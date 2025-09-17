import { call, put, takeLatest } from 'redux-saga/effects';
import { addressService } from '../../services/addressService';
import {
    submitAddressFailure,
    submitAddressRequest,
    submitAddressSuccess,
} from '../../slices/addressSlice';

// Submit address saga
function* submitAddressSaga(action) {
  try {
    const response = yield call(addressService.submitAddress, action.payload);
    
    if (response.success) {
      yield put(submitAddressSuccess(response.data));
    } else {
      yield put(submitAddressFailure(response.message || 'Failed to submit address'));
    }
  } catch (error) {
    yield put(submitAddressFailure(error.message || 'Failed to submit address'));
  }
}

// Watcher saga
export function* watchAddress() {
  yield takeLatest(submitAddressRequest.type, submitAddressSaga);
}