import ScrollableFeed from "react-scrollable-feed";
import { Message } from "../../Interface/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import FormattedRelativeTime from "../../Utils/Time";
import Avatar from "react-avatar";
import { IoMdDownload } from "react-icons/io";

type ScrollableChatPro = {
  messages: Message[];
};

const ScrollableChat = ({ messages }: ScrollableChatPro) => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const downloadFiles = async (e: any, url: string, filename: string) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message: Message, index) => (
          <div
            key={message._id} // Ensure each mapped element has a unique key
            className={`${
              message.sender._id !== currentUser._id
                ? "flex p-5 justify-start mt-2 items-center gap-2 relative group"
                : "flex mt-2 justify-end items-center gap-2"
            }`}
          >
            {message.sender._id !== currentUser._id ? (
              <div className="flex items-center gap-2">
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
                    message.files.map((file, i) => {
                      if (file.type === "image") {
                        return (
                          <div
                            key={i}
                            className="w-48 h-48 flex-shrink-0 flex items-center justify-center border-custom-blue/90 border-4"
                          >
                            <img
                              src={file.url}
                              className="object-cover w-full h-full"
                              alt=""
                            />
                            <button
                              className="float-end"
                              onClick={(e) =>
                                downloadFiles(e, file.url, "image")
                              }
                            >
                              <IoMdDownload className="mt-1" size={20} />
                            </button>
                          </div>
                        );
                      } else if (file.type === "video") {
                        return (
                          <div
                            key={i}
                            className="w-48 h-48 flex-shrink-0 border-custom-blue/90 border-4"
                          >
                            <video
                              src={file.url}
                              className="object-cover w-full h-full"
                              controls
                            />
                            <button
                              className="float-end"
                              onClick={(e) =>
                                downloadFiles(e, file.url, "video")
                              }
                            >
                              <IoMdDownload className="mt-1" size={20} />
                            </button>
                          </div>
                        );
                      } else if (file.type === "audio") {
                        return (
                          <div
                            key={i}
                            className="w-52 h-10 flex-shrink-0"
                          >
                            <audio
                              src={file.url}
                              className="object-cover border border-custom-blue rounded-full w-full h-10"
                              controls
                            />
                            <button
                              className="float-end"
                              onClick={(e) =>
                                downloadFiles(e, file.url, "audio")
                              }
                            >
                              <IoMdDownload className="mt-1" size={20} />
                            </button>
                          </div>
                        );
                      } else if (file.type === "pdf") {
                        return (
                          <div
                            key={i}
                            className="w-20 h-20 flex-shrink-0"
                          >
                            <iframe
                              src={file.url}
                              className="w-full h-full"
                              title="PDF Preview"
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  {message.message &&
                    message.message.trim() !== "" && (
                      <p
                        className={`text-sm break-words w-auto ${
                          isDarMode
                            ? "bg-custom-blue/30 text-white"
                            : "bg-gray-200"
                        } p-3 rounded-lg`}
                      >
                        {message.message}
                      </p>
                    )}
                  <small className="text-xs">
                    {FormattedRelativeTime(message.createdAt)}
                  </small>
                </div>
              </div>
            ) : (
              <div className="p-3 flex flex-col rounded-lg max-w-xs">
                {message.files.length > 0 &&
                  message.files.map((file, i) => {
                    if (file.type === "image") {
                      return (
                        <div
                          key={i}
                          className="w-48 h-48 mt-2 flex-shrink-0 flex items-center justify-center border-custom-blue/90 border-4"
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
                          key={i}
                          className="w-48 h-48 mt-2 flex-shrink-0 border-custom-blue/90 border-4"
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
                        <div
                          key={i}
                          className="w-52 mt-2 h-10 flex-shrink-0"
                        >
                          <audio
                            src={file.url}
                            className="object-cover border border-custom-blue rounded-full w-full h-10"
                            controls
                          />
                        </div>
                      );
                    } else if (file.type === "pdf") {
                      return (
                        <div
                          key={i}
                          className="w-52 h-20 mt-2 flex-shrink-0"
                        >
                          <iframe
                            src={file.url}
                            className="w-full h-full overscroll-none"
                            title="PDF Preview"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                {message.message &&
                  message.message.trim() !== "" && (
                    <p
                      className={`text-sm break-words w-auto ${
                        isDarMode ? "bg-gray-900 text-white" : "bg-gray-200"
                      } p-3 rounded-lg`}
                    >
                      {message.message}
                    </p>
                  )}
                <small className="text-xs mt-1">
                  {FormattedRelativeTime(message.createdAt)}
                </small>
              </div>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
