import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { removeSlectedChat } from "../../Redux/Slice/User/chatSlice";
import { RootState } from "../../Redux/store";
import userApi from "../../Apis/user";
import { Message, Sender } from "../../Interface/interface";
import ScrollableChat from "./ScrollableChat";
import { PiSpinnerBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import Avatar from "react-avatar";
import socket from "../../Apis/Endpoints/socket";

function SingleChat() {
  const dispatch = useDispatch();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [receiver, setReceiver] = useState<Sender | null>(null);
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(false);












  /////////////////// FETCH ALL THE MESSAGES //////////////////////////
  const fetchMessages = async () => {
    try {
      if (selectedChat) {
        setLoading(true);

        const response = await userApi.fetchAllMessages(selectedChat);
        setAllMessages(response.messages);

        const findReciver = response.messages.find(
          (msg: Message) => msg.sender._id !== currentUser._id
        );

        if (findReciver) {
          setReceiver(findReciver.sender);
        }
              setLoading(false);

      }
    } catch (error) {
                    setLoading(false);

      console.error(error);
    }
  };








  
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);






  /////////////////// HANDLE NEW MESSAGE ///////////////////////////////




  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };




  const handleSendMessage = async () => {
    if (!newMessage || !selectedChat) return;

    try {
      setLoading(true);
      const response = await userApi.sendNewMessage(selectedChat, newMessage);
      if (response) {
        setNewMessage("");
        setAllMessages([...allMessages, response.message]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };




useEffect(()=>{

  socket.emit("setup",(currentUser))

},[])



  return (
    <div
      className={`${
        selectedChat ? "col-span-full" : "hidden"
      } lg:block lg:col-span-3  border border-white`}
    >
      {selectedChat ? (
        <>
          <div className="mb-1 flex mt-16 justify-between gap-8 p-5 border-t-2 h-20 bg-custom-blue/90 backdrop:blur-xl">
            <div className="flex items-center gap-2">
              {receiver?.profile.image ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={receiver.profile.image}
                  alt=""
                />
              ) : (
                <Avatar
                  size="45"
                  className="rounded-full"
                  name={receiver?.name}
                />
              )}
              <p className="p-2 text-white text-lg">{receiver?.username}</p>
            </div>
            <IoIosCloseCircle
              size={25}
              className="mt-2 cursor-pointer"
              onClick={() => dispatch(removeSlectedChat())}
              color="white"
            />
          </div>
          <div
            id="messages"
            className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-192px)]"
          >
            <ScrollableChat messages={allMessages} />
          </div>
          <div className="flex justify-center w-full items-center border-t-2 p-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              className="flex-1 bg-gray-200 border rounded-lg py-2 px-4 mr-2 focus:outline-none focus:ring-2"
            />
           
           
              <button
                onClick={handleSendMessage}
                className="text-white px-4 py-2  border-none  rounded-lg focus:outline-none "
              >
                <IoSend className="text-blue-600" size={25} />
              </button>
          
          </div>

        </>
      ) 
      : (
        <div className="flex text-xl justify-center items-center h-[calc(100vh-192px)] mt-16">
          Select a chat to start messaging
        </div>

        
      )}

     
    </div>
  );
}

export default SingleChat;
