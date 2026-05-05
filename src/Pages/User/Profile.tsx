import ProfileAndBg from "../../Components/User/ProfileAndBg";
import { useEffect, useState } from "react";
import { PostsType, User } from "../../Interface/interface";
import userApi from "../../Apis/user";

function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [fetchAgain,setFetchAgain] = useState(false)

  async function fetchUserProfile() {
    try {
      const response = await userApi.profile();

      if (response) {
        setUserData(response.user);
        setPosts(response.posts);
        setFetchAgain(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [fetchAgain]);

  return (
    <div
      className={`col-span-full mb-16 flex justify-center lg:col-start-2 lg:col-end-3`}
    >
      <div
        className={`app-page h-full w-full max-w-[920px] overflow-auto overscroll-y-auto px-2 pb-12 sm:px-3`}
      >
        <ProfileAndBg
          setPosts={setPosts}
          setfetchAgain={setFetchAgain}
          posts={posts}
          isMyProfile
          user={userData}
          fetchAgain={fetchAgain}        />
      </div>
    </div>
  );
}

export default Profile;
