import { useEffect, useState, useCallback } from "react";
import { PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import InfiniteScroll from "react-infinite-scroll-component";
import People from "../Skleton/Posts";
import { useSelector } from "react-redux";
import { RootState } from '../../Redux/store';

function Posts() {
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const currentUser = useSelector((state:RootState)=>state.user.user);
  
  // Handle fetching posts on first visit
  const fetchAllPosts = useCallback(async () => {
    try {
      const getPosts = await userApi.getAllPosts(0);
      if (getPosts) {
        setPosts(
          getPosts.posts.filter((post: PostsType) => post?.image.length)
        );
        setHasMore(getPosts.posts.length > 0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser._id]);

  useEffect(() => {
    fetchAllPosts();
  }, [currentUser._id]);

  // Handle fetching posts on scroll
  const fetchPosts = useCallback(async () => {
    try {
      const getPosts = await userApi.getAllPosts(index);
      if (getPosts) {
        setPosts((prevPosts) => [...prevPosts, ...getPosts.posts]);
        setHasMore(getPosts.posts.length > 0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [index]);

  // Fetch next set of posts on scroll
  const fetchPostOnScroll = useCallback(() => {
    console.log("Fetching next set of posts..."); // Add logging
    setIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (index > 0) {
      fetchPosts();
    }
  }, [index, fetchPosts]);

  return (
    <div className="h-svh overflow-auto p-4" id="scrollableDiv">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostOnScroll}
        hasMore={hasMore}
        loader={<People />}
        endMessage={
          <div className="text-center py-4 text-xs text-gray-500 w-full h-40">
            <p>You have seen it all!</p>
            <p>Stay tuned for more updates.</p>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-min gap-5">
          {posts.map((post) => (
            <div>
              <img
                key={post._id} // Ensure each element has a unique key
                src={post.image[0]?.url}
                alt="Post"
                className="w-full h-52 md:h-72 object-cover mt-5 rounded-lg"
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
