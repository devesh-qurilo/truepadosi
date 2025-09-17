import { all } from 'redux-saga/effects';
import { watchAuth } from './authSaga';
// import { watchPost } from './postSaga';
// import { watchUser } from './userSaga';
import { watchAddress } from './addressSaga';
import { watchProfession } from './professionSaga';
import { watchProfileUpdate } from './profileUpdateSaga';
import { watchVerification } from './verificationSaga';

export default function* rootSaga() {
  yield all([
    watchAuth(),
    // watchUser(),
    // watchPost(),
    watchAddress(),
     watchVerification(),
     watchProfession(),
     watchProfileUpdate(),
  ]);
}