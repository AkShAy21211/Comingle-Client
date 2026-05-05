import { useEffect, useState } from "react";
import { FollowNotification } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { formatDistance } from "date-fns";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { connectToSocket } from "../../Apis/socket";
import { MdVerified } from "react-icons/md";

function Notifications() {
  const socket = connectToSocket();
  const [notifications, setNotificatioins] = useState<FollowNotification[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [fetchAgain, setFetchAgain] = useState(false);

  async function getNotification() {
    try {
      const items = await userApi.notifications();
      setFetchAgain(false);
      setNotificatioins(Array.isArray(items) ? items : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getNotification();
  }, [fetchAgain]);

  const handleNotification = () => {
    setFetchAgain((prev) => !prev);
  };

  useEffect(() => {
    socket?.on("notification", handleNotification);

    return () => {
      socket?.off("notification", handleNotification);
    };
  }, []);

  async function handleAcceptFollow(followId: string, notificationId: string) {
    try {
      await userApi.acceptFollow(followId, notificationId);
      setFetchAgain((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  }

  const renderNotification = (noti: FollowNotification) => {
    const isFollow = noti?.type === "Follow";
    const isLike = noti?.type === "Like";

    if (isFollow && noti.sourceId.requester._id === currentUser._id) {
      const recipient = noti.sourceId.recipient;
      return {
        avatar: recipient.profile?.image,
        avatarName: recipient.name,
        title: `@${recipient.name.toLowerCase()}`,
        content: noti.content,
        verified: false,
        action:
          noti.sourceId.status === "Accepted" ? (
            <button className="app-button-secondary px-4 py-2 text-sm">
              Following
            </button>
          ) : null,
      };
    }

    if (isFollow && noti.sourceId.recipient._id === currentUser._id) {
      const requester = noti.sourceId.requester;
      return {
        avatar: requester.profile?.image,
        avatarName: requester.name,
        title: `@${requester.name.toLowerCase()}`,
        content: noti.content,
        verified: false,
        action:
          noti.sourceId.status === "Pending" ? (
            <button
              onClick={() => handleAcceptFollow(noti.sourceId._id, noti._id)}
              className="app-button-primary px-4 py-2 text-sm"
            >
              Accept
            </button>
          ) : (
            <button className="app-button-secondary px-4 py-2 text-sm">
              Following
            </button>
          ),
      };
    }

    if (isLike && noti?.userId === currentUser._id) {
      const sender = noti.sourceId?.userId?.[0];
      return {
        avatar: sender?.profile?.image,
        avatarName: sender?.name || "User",
        title: `@${sender?.name?.toLowerCase() || "user"}`,
        content: noti.content,
        verified: false,
        action: null,
      };
    }

    return null;
  };

  const visibleNotifications = notifications
    .map((noti) => ({ noti, ui: renderNotification(noti) }))
    .filter((item) => item.ui);

  return (
    <div className="col-span-full lg:col-start-2 lg:col-end-3">
      <div className="app-page mx-auto w-full max-w-[920px] px-2 pb-12 sm:px-3">
        <div
          className={`app-panel rounded-[30px] border p-5 sm:p-7 ${
            isDarkMode
              ? "border-white/10 bg-slate-950/80"
              : "border-white/80 bg-white/92"
          }`}
        >
          <div className="mb-6">
            <span className="app-chip">Updates</span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Notifications
            </h1>
            <p className="mt-2 text-sm sm:text-base app-muted">
              Follow requests, likes, and recent activity from your network.
            </p>
          </div>

          {visibleNotifications.length ? (
            <div className="space-y-4">
              {visibleNotifications.map(({ noti, ui }) =>
                ui ? (
                  <div
                    key={noti._id}
                    className={`flex flex-col gap-4 rounded-[24px] border p-4 sm:p-5 md:flex-row md:items-center md:justify-between ${
                      isDarkMode
                        ? "border-white/10 bg-white/5"
                        : "border-slate-100 bg-slate-50/90"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      {ui.avatar ? (
                        <img
                          src={ui.avatar}
                          className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                          alt=""
                        />
                      ) : (
                        <Avatar
                          className="rounded-full"
                          size="56"
                          name={ui.avatarName}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-1 text-sm font-semibold sm:text-base">
                          {ui.title}
                          {ui.verified ? (
                            <MdVerified className="text-blue-600" />
                          ) : null}
                          <span className="font-normal app-muted">
                            {ui.content}
                          </span>
                        </p>
                        <p className="mt-2 text-xs sm:text-sm app-muted">
                          {formatDistance(new Date(noti.createdAt), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    {ui.action ? (
                      <div className="flex items-center justify-start md:justify-end">
                        {ui.action}
                      </div>
                    ) : null}
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200/70 px-6 py-14 text-center dark:border-white/10">
              <h2 className="text-xl font-semibold">No notifications yet</h2>
              <p className="mt-2 app-muted">
                When someone follows or interacts with you, it will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
