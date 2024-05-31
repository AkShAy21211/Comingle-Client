import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileModal from "../Common/ProfileModal";
import userApi from "../../Apis/user";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import User from "../../Interface/interface";
function ProfileAndBg() {
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
        <FaRegEdit
          onClick={() => setShowCoverMdal(true)}
          size={18}
          className={` float-end text-custom-blue right-4  text-lg relative top-20 lg:top-20`}
        />{" "}
        <img
          src={userData?.profile?.background}
          className="object-cover h-52 lg:h-72 w-full "
          alt=""
        />
      </div>
      <FaRegEdit
        size={18}
        onClick={() => setShowDpMdal(true)}
        className="float-end relative  top-24   right-0 lg:top-36 lg:mt-3  lg:right-0"
      />{" "}
      <div className="relative object-cover border shadow-lg -top-16 lg:-top-24 rounded-full lg:w-52 h-32 w-32 lg:h-52 bg-black">
        <img
          className={`h-full ${
            isDarkMode ? "bg-black backdrop:blur-lg" : "bg-white"
          } object-cover w-full rounded-full`}
          src={userData?.profile?.image}
        />
      </div>
      <div className="relative w-auto  justify-start flex-col  lg:flex-row lg:justify-center p-5 mb-8  mt-10">
        <h2 className=" -mt-16 font-bold  text-center  ">
          @{userData?.name.toLowerCase()}
        </h2>
        <p className="  font-light  my-2">{userData?.profile.bio}</p>
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
