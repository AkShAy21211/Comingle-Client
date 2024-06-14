import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slice/User/userSlice';
import adminReducer from "./Slice/Admin/adminSlice"
import uiReducer from "./Slice/Theam/theamSlice";
import chatReducer from "./Slice/User/chatSlice";


const rootReducer = combineReducers({

    user:userReducer,
    admin:adminReducer,
    chat:chatReducer,
    ui:uiReducer
   
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

