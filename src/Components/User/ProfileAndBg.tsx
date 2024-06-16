import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileModal from "../Common/ProfileModal";
import userApi from "../../Apis/user";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { User } from '../../Interface/interface';
import Avatar from 'react-avatar';



type ProfileProp={

  notOwnProfile?:boolean;
  user?:User|null;
}

function ProfileAndBg({notOwnProfile,user}:ProfileProp) {

  console.log(user);
  
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [showCoverModal, setShowCoverMdal] = useState(false);
  const [showDpModal, setShowDpMdal] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  //////// fetching user profile ///////////////

  async function fetchUserProfile() {
    try {
      const user = await userApi.profile();
      console.log("profile accessed", user);

      if (user) {
        setUserData(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

  ///////////////// handle user pprofile pic update /////////////////////

  return (
    <>
      <div className="w-full border">
       {
        !notOwnProfile &&  <FaRegEdit
          onClick={() => setShowCoverMdal(true)}
          size={18}
          className={` float-end text-custom-blue right-4  text-lg relative top-20 lg:top-20`}
        />
       }
        <img
          src={notOwnProfile?user?.profile.background:userData?.profile?.background}
          className="object-cover h-52 lg:h-72 w-full "
          alt=""
        />
      </div>
    {
      !notOwnProfile &&   <FaRegEdit
        size={18}
        onClick={() => setShowDpMdal(true)}
        className="float-end relative  top-24   right-0 lg:top-36 lg:mt-3  lg:right-0"
      />
    }
      <div className={`relative object-cover  ${notOwnProfile?user?.profile.image:userData?.profile.image?'border shadow-lg':' border-none shadow-none'}  flex justify-center -top-16 lg:-top-24 rounded-full lg:w-52 h-32 w-32 lg:h-52`}>
      {
        userData?.profile.image?  <img
          className={`h-full ${
            isDarkMode ? "bg-black backdrop:blur-lg" : "bg-white"
          } object-cover w-full rounded-full`}
          src={notOwnProfile?user?.profile.image:userData?.profile?.image}
        />:<Avatar className=" rounded-full" size="140" name={notOwnProfile?user?.name:userData?.name} />
      }
  
      </div>
      <div className="relative w-auto  justify-start flex-col  lg:flex-row lg:justify-center mb-8 mt-10 lg:mt-1 ">
        <h2 className=" -mt-14 font-bold  text-center  ">
          {notOwnProfile?user?.username:userData?.username}
        </h2>
        <p className="  font-light ">{notOwnProfile?user?.profile.bio:userData?.profile.bio}</p>
           {
      notOwnProfile &&  <div className="w-96 flex gap-1 justify-center mb-5 mt-3">
        <button className="bg-custom-blue px-5 py-3 rounded-lg text-white " onClick={()=>{userApi.followRequest(user?._id as string)}}>Follow</button>
        <button className="bg-custom-blue px-5 py-3 rounded-lg text-white ">Message</button>
      </div>
     }
      </div>
      
      <ProfileModal
        onUpdate={fetchUserProfile}
        showCoverModal={showCoverModal}
        setShowCoverMdal={setShowCoverMdal}
        showDpModal={showDpModal}
        setShowDpMdal={setShowDpMdal}
      />
    </>
  );
}

export default ProfileAndBg;
