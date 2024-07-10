import { createSlice } from "@reduxjs/toolkit";

const storedAdmin = localStorage.getItem('admin');

const initialState = {

    admin:storedAdmin?JSON.parse(storedAdmin):null,
    token:""
}


const adminSlice = createSlice({

    name:"admin",
    initialState,
    reducers:{

        adminLogin:(state,action)=>{

            
            state.admin = action.payload;
            state.token = action.payload.token
            localStorage.setItem('admin',JSON.stringify(action.payload));
             localStorage.setItem('tokan',JSON.stringify(action.payload.token));

        },
        adminLogout:(state)=>{

            state.admin = null;
            localStorage.removeItem('admin');
            localStorage.removeItem('token')

        }
    }
});



export const  {adminLogin,adminLogout} = adminSlice.actions;
export default adminSlice.reducer;
