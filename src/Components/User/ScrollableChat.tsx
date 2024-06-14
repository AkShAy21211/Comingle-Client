import ScrollableFeed from "react-scrollable-feed";
import { Message, CurrentUser } from "../../Interface/interface";
import { isLastMessage, isSameSender } from "../../Utils/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import FormattedRelativeTime from "../../Utils/Time";
import { useState } from "react";
import { PiSpinnerBold } from "react-icons/pi";
import Avatar from "react-avatar";

type ScrollableChatPro = {
  messages: Message[];
};

const ScrollableChat = ({ messages }: ScrollableChatPro) => {
  const currentUser = useSelector((state: RootState) => state.user.user);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div key={message._id}>
            {message.sender._id !== currentUser._id ? (
              <div className="flex p-5 justify-start mt-2 items-center gap-2 relative group">
               {
                message.sender.profile.image? <img
                  className="w-10 h-10 rounded-full cursor-pointer"
                  src={message.sender.profile.image}
                  alt="User Avatar"
                />:<Avatar size="40" className="rounded-full" name={message.sender.name}/>
               }
                <div className="rounded-lg max-w-xs">
                  <p className="text-sm bg-gray-300 p-3 rounded-lg">
                    {message.content}
                  </p>
                  <small className="text-xs">
                    {FormattedRelativeTime(message.createdAt)}
                  </small>
                </div>
                {/* <div className="absolute bottom-12 left-0 w-32 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {message.sender.username}
                </div> */}
              </div>
            ) : (
              <div className="flex mt-2 justify-end items-center gap-2">
                <div className="p-3 flex flex-col rounded-lg max-w-xs">
                  <p className="text-sm text-white bg-custom-blue p-3 rounded-lg">
                    {message.content}
                  </p>
                  <small className="text-xs mt-1">
                    {FormattedRelativeTime(message.createdAt)}
                  </small>
                </div>
              </div>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
