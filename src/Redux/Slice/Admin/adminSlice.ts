import { createSlice } from "@reduxjs/toolkit";

const storedAdmin = localStorage.getItem('admin');

const initialState = {

    admin:storedAdmin?JSON.parse(storedAdmin):null,
}


const adminSlice = createSlice({

    name:"admin",
    initialState,
    reducers:{

        adminLogin:(state,action)=>{

            
            state.admin = action.payload;
            localStorage.setItem('admin',JSON.stringify(action.payload));
        },
        adminLogout:(state)=>{

            state.admin = null;
            localStorage.clear()
        }
    }
});



export const  {adminLogin,adminLogout} = adminSlice.actions;
export default adminSlice.reducer;
