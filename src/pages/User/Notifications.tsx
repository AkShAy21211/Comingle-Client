import { useEffect, useState } from "react";
import { Follow, NotificationsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { formatDistance } from "date-fns";
function Notifications() {
  const [notifications, setNotificatioins] = useState<
    NotificationsType[] | null[]
  >([]);
  const [followerRequest, setFollowerRequest] = useState<Follow[] | null[]>([]);

  ////////////////// GET NOTIFICATIONS /////////////////////////////

  async function getNotification() {
    try {
      const notifications = await userApi.notifications();

      console.log("geted notificatiions.", notifications);

      if (notifications?.status) {
        setNotificatioins(notifications.notifications);
        setFollowerRequest(notifications.followers);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div className=" h-full  col-span-full lg:col-span-3  px-5">
      <div className="mt-20 p-5 overflow-y-scroll">
        {notifications &&
          notifications.map(
            (notify) =>
              followerRequest &&
              followerRequest.map((follow: Follow | null) => {
                return notify?.type === "Follow" ? (
                  <div className="flex mt-5 justify-around ">
                    <img
                      src={follow?.requester.profile.image as string}
                      alt=""
                      className="object-cover w-10 h-10 rounded-full border "
                    />
                    <p className="p-2 font-bold text-sm">
                      {"@" + follow?.requester.name.toLocaleLowerCase()}
                    </p>
                    <p className="p-2 hidden sm:flex  text-sm">
                      {notify?.content}
                    </p>
                    <button className="bg-custom-teal px-2 md:px-3  py-1 text-white text-sm rounded-lg">
                      Follow
                    </button>
                    <button className="border-2 border-custom-teal px-2 text-custom-teal  py-1 text-sm rounded-lg">
                      Ignore
                    </button>
                    <p className="p-2 hidden md:flex text-sm text-gray-500">
                      {" "}
                      {formatDistance(new Date(notify.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ) : (
                  <div></div>
                );
              })
          )}
      </div>
    </div>
  );
}

export default Notifications;
