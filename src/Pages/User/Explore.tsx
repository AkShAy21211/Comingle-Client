import { useCallback, useEffect, useState } from "react";
import ExpandableSearchBar from "../../Components/Common/ExpandableSearchBar";
import People from "../../Components/Common/People";
import Posts from "../../Components/Common/Posts";
import { User } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import _ from 'lodash';

function Explore() {
  const [isFocused, setIsFocused] = useState(false);
  const [isPosts, setIsPosts] = useState(true);
  const [isPeople, setIsPeople] = useState(false);
  const [allUsers, setAllUsers] = useState<User[] | []>([]);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

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
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  ////////////////////////////// HANDLE SEARCHU USERS /////////////////////////
 const searchUsers = useCallback(
    _.debounce(async (name) => {
      if (!name) {
        const response = await userApi.getAllUsers();
        if (response) {
          setAllUsers(response.users);
        }
      } else {

        const response = await userApi.searchUsers(name);
        if (response) {
          setAllUsers(response.users);
        }
      }
    }, 300),
    [] 
  );

  //////////////////// HANDLE SHOW PEOPLE //////////////////////////////////

  async function handleShowPeople() {
    setIsPeople(true);
    setIsPosts(false);
  }

  return (
    <div
      className={`col-span-full lg:col-start-2 lg:col-end-3`}
    >
      <div className={`app-page mb-0 pb-4`} id="top-search-bar">
        <div className={`app-panel mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] p-4 sm:p-5 md:flex-row md:items-center md:justify-between ${isDarkMode ? "border-white/10 bg-slate-900/60 text-white" : ""}`}>
        {/* SEARCH BAR FOR EXPLORE */}

        <ExpandableSearchBar
          searchUsers={searchUsers}
          setIsFocused={setIsFocused}
        />
        {/* TOOGLE BETWEEN POSTS AND PEOPLE */}

        <div className={`hidden items-center justify-end gap-3 md:flex`}>
          <button
            onClick={handleShowPosts}
            className={`${isPosts ? "app-button-primary" : "app-button-secondary"} min-w-28 px-4 py-3 text-sm`}
          >
            Posts
          </button>
          <button
            onClick={handleShowPeople}
            className={`${isPeople ? "app-button-primary" : "app-button-secondary"} min-w-28 px-4 py-3 text-sm`}
          >
            People
          </button>
        </div>
        <div
          className={`flex md:hidden  ${
            isFocused ? "hidden" : "flex"
          } justify-end`}
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
            className={`app-input w-32 bg-custom-teal text-white`}
          >
            <option value="Posts">Posts</option>
            <option value="People">People</option>
          </select>
        </div>
        </div>
      </div>

      {isPeople && <People users={allUsers} />}
      {isPosts && <Posts />}
    </div>
  );
}

export default Explore;
