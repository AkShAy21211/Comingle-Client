import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        userLogout: (state) => {
            state.user = null;
            localStorage.removeItem('users');
        },
         updateUserPlan: (state,action) => {
            state.user.isPremium = action.payload;

        },
        updateUser:(state,action)=>{

            console.log(action);
            
            state.user.profile = action.payload
        }
    }
});

export const { userLogin, userLogout ,updateUser} = userSlice.actions;
export default userSlice.reducer;
