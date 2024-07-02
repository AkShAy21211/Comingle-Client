import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slice/User/userSlice';
import adminReducer from "./Slice/Admin/adminSlice"
import uiReducer from "./Slice/Theam/theamSlice";
import chatReducer from "./Slice/User/chatSlice";
import peerReducer from "./Slice/User/peerSlice"

const rootReducer = combineReducers({

    user:userReducer,
    admin:adminReducer,
    chat:chatReducer,
    peer:peerReducer,
    ui:uiReducer
   
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

