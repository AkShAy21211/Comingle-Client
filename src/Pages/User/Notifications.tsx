import { useEffect, useState } from "react";
import { FollowNotification } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { formatDistance } from "date-fns";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {connectToSocket} from "../../Apis/socket";
function Notifications() {
   
  const socket = connectToSocket()

  const [notifications, setNotificatioins] = useState<FollowNotification[]>([]);

  const currentUser = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [fetchAgain, setFetchAgain] = useState(false);

  ////////////////// GET NOTIFICATIONS /////////////////////////////

  async function getNotification() {
    try {
      const notifications = await userApi.notifications();
      setFetchAgain(false);
      setNotificatioins(notifications);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getNotification();
  }, [fetchAgain]);

  const handleNotification = () => {
    setFetchAgain(!fetchAgain);
  };
  useEffect(() => {
    socket?.on("notification", handleNotification);

    return () => {
      socket?.off("notification", handleNotification);
    };
  }, [handleNotification]);

  async function handleAcceptFollow(followId: string, notificationId: string) {
    try {
      await userApi.acceptFollow(followId, notificationId);

    } catch (err) {
      console.error(err);
    }
  }
  console.log("calling notonsffdfsff", notifications);

  return (
    <div
      className={` ${
        isDarkMode ? "bg-black" : ""
      } h-screen   col-span-full lg:col-span-3   mt-20 px-5`}
    >
      {notifications.length > 0 &&
        notifications.map((noti) => (
          <div
            className="  p-5 overflow-y-scroll mt-auto flex justify-between"
            key={noti?._id}
          >
            {/* if the current user is the requester  */}

            {noti?.type === "Follow" &&
              noti.sourceId.requester._id === currentUser._id &&
              noti.sourceId.status === "Accepted" && (
                <>
                  {noti.sourceId.recipient.profile ? (
                    <img
                      src={noti.sourceId.recipient.profile.image}
                      className="rounded-full w-14 h-14"
                      alt=""
                    />
                  ) : (
                    <Avatar
                      className="rounded-full"
                      size="60"
                      name={noti.sourceId.recipient.name}
                    />
                  )}

                  <div className="p-3  ">
                    {"@" + noti.sourceId.recipient.name.toLowerCase()}{" "}
                    <span className="font-light">{noti.content}</span>{" "}
                    <span className="font-bold md:hidden">
                      {" "}
                      {formatDistance(noti.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <button
                    className={`border border-custom-blue text-custom-blue border-custom-blue'} px-4 rounded-xl mt-2  h-10`}
                  >
                    Following
                  </button>
                  <p className="p-5 text-sm hidden md:block">
                    {formatDistance(noti.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </>
              )}

            {/* IF CURRENT USER IS NOT THE REQUESTER */}

            {noti?.type === "Follow" &&
              noti.sourceId.recipient._id === currentUser._id &&
              noti.sourceId.status === "Accepted" && (
                <>
                  {noti.sourceId.requester.profile ? (
                    <img
                      src={noti.sourceId.requester.profile.image}
                      className="rounded-full w-14 h-14"
                      alt=""
                    />
                  ) : (
                    <Avatar
                      className="rounded-full"
                      size="60"
                      name={noti.sourceId.requester.name}
                    />
                  )}

                  <div className="p-3  ">
                    {"@" + noti.sourceId.requester.name.toLowerCase()}{" "}
                    <span className="font-light">{noti.content}</span>{" "}
                    <span className="font-bold md:hidden">
                      {" "}
                      {formatDistance(noti.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <button
                    className={`border border-custom-blue text-custom-blue border-custom-blue'} px-4 rounded-xl mt-2  h-10`}
                  >
                    Following
                  </button>
                  <p className="p-5 text-sm hidden md:block">
                    {formatDistance(noti.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </>
              )}

            {noti?.type === "Follow" &&
              noti.sourceId.recipient._id === currentUser._id &&
              noti.sourceId.status === "Pending" && (
                <>
                  {noti.sourceId.requester.profile ? (
                    <img
                      src={noti.sourceId.requester.profile.image}
                      className="rounded-full w-14 h-14"
                      alt=""
                    />
                  ) : (
                    <Avatar
                      className="rounded-full"
                      size="60"
                      name={noti.sourceId.requester.name}
                    />
                  )}

                  <div className="p-3  ">
                    {"@" + noti.sourceId.requester.name.toLowerCase()}{" "}
                    <span className="font-light">{noti.content}</span>{" "}
                    <span className="font-bold md:hidden">
                      {" "}
                      {formatDistance(noti.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleAcceptFollow(noti.sourceId._id, noti._id)
                    }
                    className={`border border-custom-blue text-custom-blue border-custom-blue'} px-4 rounded-xl mt-2  h-10`}
                  >
                    Follow
                  </button>
                  <p className="p-5 text-sm hidden md:block">
                    {formatDistance(noti.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </>
              )}
            {noti?.type === "Like" && noti?.userId === currentUser._id && (
              <>
                {noti.sourceId?.userId[0]?.profile?.image ? (
                  <img
                    src={noti?.sourceId?.userId[0]?.profile?.image}
                    className="rounded-full w-14 h-14"
                    alt=""
                  />
                ) : (
                  <Avatar
                    className="rounded-full"
                    size="55"
                    name={noti?.sourceId?.userId[0]?.name}
                  />
                )}

                <div className="p-3  ">
                  {"@" + noti?.sourceId?.userId[0]?.name?.toLowerCase()}{" "}
                  <span className="font-light">{noti.content}</span>{" "}
                  <span className="font-bold md:hidden">
                    {" "}
                    {formatDistance(noti.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <p className="p-5 text-sm hidden md:block">
                  {formatDistance(noti.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default Notifications;
