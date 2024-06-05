import { useEffect, useState } from "react";
import {
  NotificationsType,
} from "../../Interface/interface";
import userApi from "../../Apis/user";
import { formatDistance } from "date-fns";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
function Notifications() {
  const [notifications, setNotificatioins] = useState<
    NotificationsType[] | null[]
  >([]);
  const [followUser,setFollowUser] = useState(false);
  const currentUser = useSelector((state:RootState)=>state.user.user)

  console.log(currentUser);
  

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
  }, [followUser]);




  async function handleAcceptFollow(followId:string,notificationId:string) {
    try {
      console.log('called');
      
       await userApi.acceptFollow(followId,notificationId);
       setFollowUser(true)
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className=" h-screen  col-span-full lg:col-span-3 mt-20  px-5">
      {notifications.map((noti) => (
        <div className="  p-5 overflow-y-scroll flex justify-around">


          {/* if the current user is the requester  */}

          {noti?.type === "Follow" && noti.sourceId.requester._id === currentUser._id && noti.sourceId.status==='Accepted'&&(
            <>
            {
             noti.sourceId.recipient.profile ?<img src={noti.sourceId.recipient.profile.image} className="rounded-full w-14 h-14" alt="" />:<Avatar className="rounded-full" size="60" name={noti.sourceId.recipient.name}/>
            }

              <div className="p-3  ">{"@"+noti.sourceId.recipient.name.toLowerCase()}  <span className="font-light">{noti.content}</span> <span className="font-bold md:hidden"> {formatDistance(noti.createdAt,new Date(),{addSuffix:true})}</span></div>
              <button  className={`border border-custom-blue text-custom-blue border-custom-blue'} px-4 rounded-xl mt-2  h-10`}>Following</button>
              <p className="p-5 text-sm hidden md:block">{formatDistance(noti.createdAt,new Date(),{addSuffix:true})}</p>
            </>
          ) }

           {/* if not the CurrentUser use id the requester   */}

          {noti?.type === "Follow" && noti.sourceId.requester._id !== currentUser._id && (noti.sourceId.status==='Accepted'||'Pending')&&(
            <>
            {
             noti.sourceId.requester.profile ?<img src={noti.sourceId.requester.profile.image} className="rounded-full w-14 h-14" alt="" />:<Avatar className="rounded-full" size="60" name={noti.sourceId.requester.name}/>
            }

              <div className="p-3  ">{"@"+noti.sourceId.requester.name.toLowerCase()}  <span className="font-light">{noti.content}</span> <span className="font-bold md:hidden"> {formatDistance(noti.createdAt,new Date(),{addSuffix:true})}</span></div>
              <button onClick={noti.sourceId.status==='Pending'?()=>handleAcceptFollow(noti.sourceId._id,noti._id):undefined} className={`${noti.sourceId.status==='Pending'?'bg-custom-blue text-white':'border border-custom-blue text-custom-blue'} border-custom-blue'} px-4 rounded-xl mt-2  h-10`}>{noti.sourceId.status==='Pending'?'Follow':"Following"}</button>
              <p className="p-5 text-sm hidden md:block">{formatDistance(noti.createdAt,new Date(),{addSuffix:true})}</p>
            </>
          ) }
          

        </div>
      ))}
    </div>
  );
}

export default Notifications;
