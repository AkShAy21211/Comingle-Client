import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    user:null
}

const userSlice = createSlice({

    initialState,
    name:"user",
    reducers:{

        userLogin:(state,action)=>{

            state.user = action.payload
        },
        userLogout:(state)=>{

            state.user = null;
        }
    }
});

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;