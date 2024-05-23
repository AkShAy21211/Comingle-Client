import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slice/User/userSlice';
import adminReducer from "./Slice/Admin/adminSlice"
import uiReducer from "./Slice/Theam/theamSlice";
const rootReducer = combineReducers({


    user:userReducer,
    admin:adminReducer,
    ui:uiReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

