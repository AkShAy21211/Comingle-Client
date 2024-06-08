import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CreatePost from "./CreatePost";
import Contents from "./Contets";
import { PiShareFatThin } from "react-icons/pi";
import FormattedRelativeTime from "../../Utils/Time";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState, useRef } from "react";
import { Likes, PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import Avatar from "react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "../Skleton/PostSkleton";
import postModel from "../../../../backend/src/infrastructure/database/postModel";
import Like from "../../../../backend/src/domain/entities/like";

function Posts() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [liked,setLike] = useState(false);

  //////////////////////    HANDLE FETCTCH POST ON FIRST VISIT ////////////////////////

  async function fetchAllPosts() {
    try {
      setLoading(true);
      const getPosts = await userApi.getAllPosts(0);
      if (getPosts) {
        setLoading(false);

        setPosts(getPosts.posts);
        setHasMore(getPosts.posts.length > 0);
        console.log(posts);
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  /////////////////////////// HANDLE POST REPORT //////////////////////////

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (postId: string) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  /////////////// HANDLE FETCH POT ON SCROLL ///////////////////////////////

  async function fetchPosts() {
    try {
      setLoading(true);

      const getPosts = await userApi.getAllPosts(index);
      if (getPosts) {
        setLoading(false);

        setPosts((prevPosts) => [...prevPosts, ...getPosts.posts]);
        setHasMore(getPosts.posts.length > 0);
        console.log(posts);
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }

  const fetchPostOnScroll = () => {
    setIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (index > 0) {
      fetchPosts();
    }
  }, [index]);

  //////////////////////// HANDLE USER LIKE POST //////////////////////////

  async function likePost(postId: string, userId: string) {
    try {
      const likeResponse = await userApi.likePost(postId, userId);
      if (likeResponse) {

        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const newLike: Likes = likeResponse.likes;
              return {
                ...post,
                likes: { ...post.likes, ...newLike },
              };
            }
            return post;
          })
        );

        console.log(posts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={` mt-16 pt-1 lg:mt-0 ${
        isDarkMode ? "bg-black text-white" : ""
      } col-span-full   overflow-scroll h-svh lg:col-start-2 lg:col-end-5`}
      id="scrollableDiv"
    >
      <CreatePost fetchPost={fetchAllPosts} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostOnScroll}
        hasMore={hasMore}
        loader={loading && <PostSkeleton />}
        endMessage={
          <div className="text-center py-4 text-xs text-gray-500 w-full  h-40">
            <p> You have seen it all! </p>
            <p>Stay tuned for more updates.</p>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex justify-center">
          <div className="w-full lg:w-3/5">
            {posts.map((post) => (
              <div
                key={post._id}
                className={`w-full ${
                  isDarkMode ? "bg-black text-white" : ""
                } flex flex-col justify-between items-center mb-10 relative`}
              >
                <div className="flex items-center mb-3 p-2 w-full">
                  {post.postedUser.profile.image ? (
                    <img
                      className="w-10 h-10 mr-4 rounded-full"
                      src={post.postedUser.profile.image}
                    />
                  ) : (
                    <Avatar
                      name={post.postedUser.name}
                      className="rounded-full me-4"
                      size="35"
                    />
                  )}
                  <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
                    <h3 className="text-base md:text-lg font-semibold">
                      {post.postedUser.name.toLowerCase()}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 md:mt-0">
                      {FormattedRelativeTime(post.createdAt)}
                    </p>
                  </div>
                  <div ref={dropdownRef}>
                    <HiOutlineDotsVertical
                      className="ml-1 cursor-pointer"
                      size={20}
                      onClick={() => handleDropdownToggle(post._id)}
                    />
                    {showDropdown === post._id && (
                      <div className="absolute mt-2 right-0 z-10 bg-gray-200 divide-y shadow-lg border divide-gray-100 rounded-lg w-44">
                        <ul className="py-2 text-sm">
                          <li>
                            <a href="#" className="block px-4 py-2">
                              Report
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {post.image?.length > 0 && <Contents content={post.image} />}
                <div
                  className={`w-full ${
                    isDarkMode ? "bg-black" : ""
                  } flex items-center mt-2 p-2 md:p-0 sm:text-sm font-light md:font-normal break-words`}
                >
                  <p className="text-wrap w-full">{post.description}</p>
                </div>

                <div
                  className={`w-full ${
                    isDarkMode ? "bg-black" : ""
                  } flex justify-around gap-8 p-4`}
                >
                  <div className="flex w-full gap-5">
                    <IoMdHeartEmpty
                    className={post.likes.userId &&post.likes.userId.includes(currentUser._id)?'text-red-500':''}
                      onClick={() => {
                        likePost(post._id, currentUser._id);
                      }}
                      size={25}
                    />
                    <FaRegComment size={20} />
                    <PiShareFatThin size={25} className="font-bold" />
                  </div>

                  <CiSaveDown2 size={27} className="font-bold" />
                </div>
                <div className="flex w-full px-4 gap-5">
                  <p className="text-xs">
                    {post.likes.userId ? post.likes.userId.length : 0} likes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
