import { createSlice } from "@reduxjs/toolkit";
import { ChatType } from "../../../Interface/interface";

const initialState = {
  selectedChat: { chatId: null, receiver: null },
  unreadMessage: [],
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat.chatId = action.payload.chatId;
      state.selectedChat.receiver = action.payload.reciver;
    },

    removeSlectedChat: (state) => {
      state.selectedChat = { chatId: null, receiver: null };
    },

    setUnreadMessage: (state, action) => {
      console.log('set',action.payload);

      
      state.unreadMessage = state.unreadMessage||[]

      state.unreadMessage.push(action.payload as never);


    },
    removeUnreadMessage: (state, action) => {
      console.log('remove',action.payload);
      
      state.unreadMessage = state.unreadMessage.filter(

        (chat: ChatType) => chat._id !== action.payload
      );
    },
  },
});

export const {
  setSelectedChat,
  removeSlectedChat,
  setUnreadMessage,
  removeUnreadMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
