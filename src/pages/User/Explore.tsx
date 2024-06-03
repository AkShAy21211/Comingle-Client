import { useEffect, useState } from "react";
import ExpandableSearchBar from "../../Components/Common/ExpandableSearchBar";
import People from "../../Components/Common/People";
import Posts from "../../Components/Common/Posts";
import { User } from "../../Interface/interface";
import userApi from "../../Apis/user";





function Explore() {
  const [isFocused, setIsFocused] = useState(false);
  const [isPosts, setIsPosts] = useState(true);
  const [isPeople, setIsPeople] = useState(false);
  const [allUsers, setAllUsers] = useState<User[] | []>([]);
  const [allPosts, setAllPosts] = useState([]);
  const [followers, setFollowers] = useState([]);

  //////////////////// HANDLE SHOW POSTS ///////////////////////////////

  async function handleShowPosts() {
    setIsPosts(true);
    setIsPeople(false);
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await userApi.getAllUsers();

        if (users) {
          setAllUsers(users.users);
          setFollowers(users.followers);

        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  /////////////////// HANDLE FOLLOWING /////////////////////////////////////

  async function handleFollow(id: string) {
    const follow = await userApi.followRequest(id);
    setFollowers(follow.follow);
  }




  //////////////////// HANDLE SHOW PEOPLE //////////////////////////////////

  async function handleShowPeople() {
    setIsPeople(true);
    setIsPosts(false);
  }

  return (
    <div className=" h-full  col-span-full lg:col-span-3  ">
      <div className="   flex  md:flex   mt-20 px-5" id="top-search-bar">
        {/* SEARCH BAR FOR EXPLORE */}

        <ExpandableSearchBar
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
        {/* TOOGLE BETWEEN POSTS AND PEOPLE */}

        <div className={`w-96 h-8  justify-end hidden md:flex gap-5`}>
          <button
            onClick={handleShowPosts}
            className="bg-custom-teal p-4 rounded-lg text-white text-center flex justify-center items-center"
          >
            Posts
          </button>
          <button
            onClick={handleShowPeople}
            className="bg-custom-teal p-4 rounded-lg text-white text-center flex justify-center items-center"
          >
            People
          </button>
        </div>
        <div
          className={`w-96 h-8  flex md:hidden  ${
            isFocused ? "hidden" : "flex"
          } justify-end  h-9  gap-5`}
        >
          <select
            onChange={(e) => {
              const value = e.target.value === "People";

              value
                ? (setIsPeople(true), setIsPosts(false))
                : (setIsPeople(false), setIsPosts(true));
            }}
            name="explore-type"
            id="explore-type"
            className={`bg-custom-tealborder-none outline-none p-2 bg-custom-teal text-white rounded-lg `}
          >
            <option value="Posts">Posts</option>
            <option value="People">People</option>
          </select>
        </div>
      </div>

      <div className="h-screen p-5 flex gap-16 mt-8 w-full justify-center">
        {isPeople && (
          <People
            users={allUsers}
          />
        )}
        {isPosts && <Posts allPosts={allPosts} />}

      </div>
    </div>
  );
}

export default Explore;
