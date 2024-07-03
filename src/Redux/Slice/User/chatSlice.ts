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
      console.log(action.payload);

      
      state.unreadMessage = state.unreadMessage||[]

      state.unreadMessage.push(action.payload as never);

      const existingChat = state.unreadMessage.find((c:ChatType)=>c._id === action.payload.chat._id)

      if(existingChat) return;

      state.unreadMessage.push(action.payload.chat as never)
    },
    removeUnreadMessage: (state, action) => {
      state.unreadMessage = state.unreadMessage.filter(
        (chat: any) => chat._id !== action.payload
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
