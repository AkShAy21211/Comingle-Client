import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import userReducer from './Slice/userSlice';
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export default store;
