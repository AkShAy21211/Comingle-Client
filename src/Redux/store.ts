import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import userReducer from './Slice/userSlice';
import adminReducer from "./Slice/adminSlice"
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    user: userReducer,
    admin:adminReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export default store;
