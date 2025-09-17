import { call, put, takeLatest } from 'redux-saga/effects';
import { professionService } from '../../services/professionService';
import {
    submitProfessionFailure,
    submitProfessionRequest,
    submitProfessionSuccess,
} from '../../slices/professionSlice';

// Submit profession saga
function* submitProfessionSaga(action) {
  try {
    const response = yield call(professionService.submitProfession, action.payload);
    
    if (response.success) {
      yield put(submitProfessionSuccess(response.data));
    } else {
      yield put(submitProfessionFailure(response.message || 'Failed to submit profession'));
    }
  } catch (error) {
    yield put(submitProfessionFailure(error.message || 'Failed to submit profession'));
  }
}

// Watcher saga
export function* watchProfession() {
  yield takeLatest(submitProfessionRequest.type, submitProfessionSaga);
}