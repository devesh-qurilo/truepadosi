import { call, put, takeLatest } from 'redux-saga/effects';
import { profileUpdateService } from '../../services/profileUpdateService';
import {
    updateProfileFailure,
    updateProfileRequest,
    updateProfileSuccess,
} from '../../slices/profileUpdateSlice';

// Update profile saga
function* updateProfileSaga(action) {
  try {
    const response = yield call(profileUpdateService.updateProfile, action.payload);
    
    if (response.success) {
      yield put(updateProfileSuccess(response.data));
    } else {
      yield put(updateProfileFailure(response.message || 'Failed to update profile'));
    }
  } catch (error) {
    yield put(updateProfileFailure(error.message || 'Failed to update profile'));
  }
}

// Watcher saga
export function* watchProfileUpdate() {
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
}