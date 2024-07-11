import { createSlice } from "@reduxjs/toolkit";


const isDarkMode: boolean = localStorage.getItem('isDarkMode') !== null 
  ? JSON.parse(localStorage.getItem('isDarkMode') as string)
  : false; 

const initialState = {
  isDarkMode,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode));
    },
  },
});

export const { toggleMode } = uiSlice.actions;
export default uiSlice.reducer;
