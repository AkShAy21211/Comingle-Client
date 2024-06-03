import { useEffect, useState } from "react";
import {  FollowNotification, NotificationsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { formatDistance } from "date-fns";
function Notifications() {
  const [notifications, setNotificatioins] = useState<
    NotificationsType[] | null[]
  >([]);

  ////////////////// GET NOTIFICATIONS /////////////////////////////

  async function getNotification() {
    try {
      const notifications = await userApi.notifications();

      console.log("geted notificatiions.", notifications);

      if (notifications?.status) {
        setNotificatioins(notifications.notifications);
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
       
         
      </div>
    </div>
  );
}

export default Notifications;
