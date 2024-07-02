import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 selectedChat:{chatId:null,receiver:null},
 unreadMessage:[]
};


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        setSelectedChat: (state, action) => {
                      
            state.selectedChat.chatId = action.payload.chatId;
            state.selectedChat.receiver  = action.payload.reciver

        },

        removeSlectedChat:(state)=>{
            state.selectedChat.chatId = null;
            state.selectedChat.receiver = null;
        },

        setUnreadMessage:(state,action)=>{

            console.log(action.payload);
            
            if(!state.unreadMessage){

                state.unreadMessage = []
            }

            state.unreadMessage.push(action.payload as never);
        },
        removeUnreadMessage:(state,action)=>{

            
            state.unreadMessage = state.unreadMessage.filter((chat:any)=>(chat._id !== action.payload))
        }
      
    }
});

export const { setSelectedChat,removeSlectedChat,setUnreadMessage,removeUnreadMessage} = chatSlice.actions;

export default chatSlice.reducer;
