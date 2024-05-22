import { ToastContainer } from "react-toastify";
import CountBox from "../../Components/User/CountBox";
import PostGrid from "../../Components/User/PostGrid";
import ProfileAndBg from "../../Components/User/ProfileAndBg";

function Profile() {
  return (
    <div
      className=" h-full mb-16 flex justify-center 
       col-span-full lg:col-start-2 lg:col-end-5 
       "
    >
      <div
        className=" h-full shadow-xl overflow-auto overscroll-y-auto  lg:w-4/5 
       bg-red flex flex-col 
        items-center mb-10"
      >
        <ProfileAndBg />
        <CountBox/>
        <PostGrid/>

      </div>
    </div>
  );
}

export default Profile;
