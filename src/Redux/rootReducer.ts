import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slice/User/userSlice';
import adminReducer from "./Slice/Admin/adminSlice"

const rootReducer = combineReducers({


    user:userReducer,
    admin:adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

