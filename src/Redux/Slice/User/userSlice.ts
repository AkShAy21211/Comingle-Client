import { createSlice } from "@reduxjs/toolkit";



const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null
};



const userSlice = createSlice({

    initialState,
    name:"user",
    reducers:{

        userLogin:(state,action)=>{

            state.user = action.payload
            localStorage.setItem('user',JSON.stringify(action.payload))

            
        },
        userLogout:(state)=>{

            state.user = null;
            localStorage.removeItem('user');
        }
    }
});

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;