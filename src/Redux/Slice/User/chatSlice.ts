import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat:null,
  reciver:null
};

console.log(initialState);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        setSelectedChat: (state, action) => {
          
            console.log(action);
            
            state.selectedChat = action.payload.chatId;
            state.reciver = action.payload.reciver
        },

        removeSlectedChat:(state)=>{
            state.selectedChat = null;
        }
      
    }
});

export const { setSelectedChat,removeSlectedChat} = chatSlice.actions;

export default chatSlice.reducer;
