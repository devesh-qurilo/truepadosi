import { configureStore } from '@reduxjs/toolkit';
import rootSaga from './sagas';
const createSagaMiddleware = require('redux-saga').default;

// Import slices - make sure these paths are correct
import addressReducer from '../slices/addressSlice';
import authReducer from '../slices/authSlice';
import postReducer from '../slices/postSlice';
import professionReducer from '../slices/professionSlice';
import profileUpdateReducer from '../slices/profileUpdateSlice';
import userReducer from '../slices/userSlice';
import verificationReducer from '../slices/verificationSlice';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it on the Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    address: addressReducer,
    verification: verificationReducer,
    profession: professionReducer,
    profileUpdate: profileUpdateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
});

// Then run the saga
sagaMiddleware.run(rootSaga);

export default store;