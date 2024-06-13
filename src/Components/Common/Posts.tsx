import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";
import { PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import InfiniteScroll from "react-infinite-scroll-component";
import People from "../Skleton/Posts";



function Posts() {
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostsType[]>([]);

  // Handle fetching posts on first visit
  const fetchAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      const getPosts = await userApi.getAllPosts(0);
      if (getPosts) {
        setPosts(getPosts.posts);
        setHasMore(getPosts.posts.length > 0);
      }
      console.log(getPosts);
      const postedUsers = getPosts.posts.map((post: any) => post.postedUser);

     
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Handle fetching posts on scroll
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const getPosts = await userApi.getAllPosts(index);
      if (getPosts) {
        setPosts((prevPosts) => [...prevPosts, ...getPosts.posts]);
        setHasMore(getPosts.posts.length > 0);

      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
                src={
                  post.image[0] ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
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
