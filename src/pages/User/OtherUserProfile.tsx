import CountBox from "../../Components/User/CountBox";
import PostGrid from "../../Components/User/PostGrid";
import ProfileAndBg from "../../Components/User/ProfileAndBg";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";


function OtherUserProfile() {

    const notOwnPrfile = true;
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  return (
   <div
      className={` ${isDarkMode?'bg-black text-white':''} h-full mb-16 flex justify-center 
       col-span-full lg:col-start-2 lg:col-end-5 
       `}
    >
      <div
        className={` h-full ${isDarkMode?' lg:border-x':''} shadow-xl overflow-auto overscroll-y-auto  lg:w-4/5 
       bg-red flex flex-col 
        items-center mb-10`}
      >
        <ProfileAndBg notOwnProfile />
        <CountBox/>
        <PostGrid/>

      </div>
    </div>
  )
}

export default OtherUserProfile
