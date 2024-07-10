import ProfileAndBg from "../../Components/User/ProfileAndBg";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useParams } from "react-router-dom";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { PostsType, User } from "../../Interface/interface";

function OtherUserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const fetchUserProfile = async () => {
    try {
      if (username) {
        
        const response = await userApi.getOtherUserProfile(username);

        if (response) {
          setUserData(response.user);
          setPosts(response.posts);
          setFetchAgain(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchAgain]);

  return (
    <div
      className={` ${
        isDarkMode ? "bg-black text-white" : ""
      } h-full mb-16 flex justify-center 
       col-span-full lg:col-start-2 lg:col-end-5 
       `}
    >
      <div
        className={` h-full ${
          isDarkMode ? " lg:border-x" : ""
        } shadow-xl overflow-auto overscroll-y-auto  w-full
       bg-red flex flex-col 
        items-center mb-10`}
      >
        <ProfileAndBg
          setPosts={setPosts}
          fetchAgain={setFetchAgain}
          posts={posts}
          user={userData}
          isMyProfile={false}
        />
      </div>
    </div>
  );
}

export default OtherUserProfile;
