import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token:""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', JSON.stringify(action.payload.token));

        },
        userLogout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');

        },
         updateUserPlan: (state,action) => {
            state.user.isPremium = action.payload;

        },
        updateUser:(state,action)=>{

            
            state.user.profile = action.payload
        },
        updatePLan:(state)=>{

            state.user.isPremium = true;
        }
    }
});

export const { userLogin, userLogout,updatePLan ,updateUser} = userSlice.actions;
export default userSlice.reducer;
