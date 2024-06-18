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
  const isDarMode = useSelector((state:RootState)=>state.ui.isDarkMode);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div key={message._id}>
            {message.sender._id !== currentUser._id ? (
              <div className="flex p-5 justify-start mt-2 items-center gap-2 relative group">
                {message.sender.profile.image ? (
                  <img
                    className="w-10 h-10 rounded-full cursor-pointer"
                    src={message.sender.profile.image}
                    alt="User Avatar"
                  />
                ) : (
                  <Avatar
                    size="40"
                    className="rounded-full"
                    name={message.sender.name}
                  />
                )}
                <div className="rounded-lg max-w-xs">
                  {message.files.length > 0 &&
                    message.files.map(
                      (file: { url: string; type: string; _id: string }) => {
                        if (file.type === "image") {
                          return (
                            <div
                              key={file._id}
                              className="w-48 h-48 flex-shrink-0 flex items-center justify-center border-custom-blue/90 border-4"
                            >
                              <img
                                src={file.url}
                                className="object-cover w-full h-full"
                                alt=""
                              />
                            </div>
                          );
                        } else if (file.type === "video") {
                          return (
                            <div
                              key={file._id}
                              className="w-48 h-48 flex-shrink-0 border-custom-blue/90 border-4"
                            >
                              <video
                                src={file.url}
                                className="object-cover w-full h-full"
                                controls
                              />
                            </div>
                          );
                        } else if (file.type === "audio") {
                          return (
                            <div key={file._id} className="w-20 h-20 flex-shrink-0">
                              <audio
                                src={file.url}
                                className="object-cover w-full h-full"
                                controls
                              />
                            </div>
                          );
                        } else if (file.type === "pdf") {
                          return (
                            <div key={file._id} className="w-20 h-20 flex-shrink-0">
                              <iframe
                                src={file.url}
                                className="w-full h-full"
                                title="PDF Preview"
                              />
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  {message.message && message.message.trim() !== "" && (  // Check if message.message exists and is not empty
                    <p className={`text-sm ${isDarMode?'bg-custom-blue/30 text-white':"bg-gray-200"} p-3 rounded-lg`}>
                      {message.message}
                    </p>
                  )}
                  <small className="text-xs">
                    {FormattedRelativeTime(message.createdAt)}
                  </small>
                </div>
              </div>
            ) : (
              <div className="flex mt-2 justify-end items-center gap-2">
                <div className="p-3 flex flex-col rounded-lg max-w-xs">
                  {message.files.length > 0 &&
                    message.files.map(
                      (file: { url: string; type: string; _id: string }) => {
                        if (file.type === "image") {
                          return (
                            <div
                              key={file._id}
                              className="w-48 h-48 flex-shrink-0 flex items-center justify-center border-custom-blue/90 border-4"
                            >
                              <img
                                src={file.url}
                                className="object-cover w-full h-full"
                                alt=""
                              />
                            </div>
                          );
                        } else if (file.type === "video") {
                          return (
                            <div
                              key={file._id}
                              className="w-48 h-48 flex-shrink-0 border-custom-blue/90 border-4"
                            >
                              <video
                                src={file.url}
                                className="object-cover w-full h-full"
                                controls
                              />
                            </div>
                          );
                        } else if (file.type === "audio") {
                          return (
                            <div key={file._id} className="w-20 h-20 flex-shrink-0">
                              <audio
                                src={file.url}
                                className="object-cover w-full h-full"
                                controls
                              />
                            </div>
                          );
                        } else if (file.type === "pdf") {
                          return (
                            <div key={file._id} className="w-20 h-20 flex-shrink-0">
                              <iframe
                                src={file.url}
                                className="w-full h-full"
                                title="PDF Preview"
                              />
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  {message.message && message.message.trim() !== "" && (  // Check if message.message exists and is not empty
                    <p className={`text-sm  ${isDarMode?'bg-gray-900 text-white':"bg-gray-200"} p-3 rounded-lg`}>
                      {message.message}
                    </p>
                  )}
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
