import { useEffect, useState, useCallback } from "react";
import { PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import InfiniteScroll from "react-infinite-scroll-component";
import People from "../Skleton/Posts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useNavigate } from "react-router-dom";

function Posts() {
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

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

  const fetchPostOnScroll = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (index > 0) {
      fetchPosts();
    }
  }, [index, fetchPosts]);

  const renderContent = (content: {
    type: string;
    url: string;
    _id: string;
  }) => {
    if (content.type === "image") {
      return (
        <div className="aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-slate-100/50 dark:bg-white/5">
          <img
            key={content._id}
            src={content.url}
            alt="Post"
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-slate-100/50 dark:bg-white/5">
        <video
          key={content._id}
          src={content.url}
          className="h-full w-full object-cover"
        />
      </div>
    );
  };

  return (
    <div className="app-page h-[calc(100vh-5rem)] overflow-auto pt-6" id="scrollableDiv">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostOnScroll}
        hasMore={hasMore}
        loader={<People />}
        endMessage={
          <div className="h-40 w-full py-4 text-center text-xs text-gray-500">
            <p>You have seen it all!</p>
            <p>Stay tuned for more updates.</p>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <div
              className="group app-panel cursor-pointer overflow-hidden rounded-[26px] p-2 transition duration-300 hover:-translate-y-1"
              key={post._id}
              onClick={() => navigate("/post/" + post._id)}
            >
              <div className="overflow-hidden rounded-[20px]">
                {renderContent(post.image[0])}
              </div>
            </div>
          ))}
          {!posts.length && (
            <div className="app-panel col-span-full mx-auto flex min-h-52 max-w-xl flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="app-chip">No posts yet</span>
              <p className="text-lg font-semibold text-slate-900">Your feed is ready for fresh content.</p>
              <p className="app-muted">Once people share photos or videos, they'll show up here.</p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
