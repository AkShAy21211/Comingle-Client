import React, { useCallback, useEffect, useState } from "react";
import Avatar from "react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "../../Components/Skleton/PostSkleton";
import Contents from "../../Components/User/Contets";
import FormattedRelativeTime from "../../Utils/Time";
import adminApi from "../../Apis/admin";
import { PostsType, ReportType } from "../../Interface/interface";

function Posts() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [totalReports, setTotalReport] = useState<ReportType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState<ReportType[]>([]);
  const getPosts = useCallback(async () => {
    try {
      const response = await adminApi.getAllPosts(index);
      if (response) {
        console.log(response);

        setPosts((prevPosts) => [...prevPosts, ...response.posts]);
        setHasMore(response.posts.length > 0);
        setTotalPosts((prev) => prev + response.posts.length);
        setTotalReport(response.retports);
      }
    } catch (error) {
      console.error(error);
    }
  }, [index]);

  useEffect(() => {
    getPosts();
  }, [index, getPosts]);

  const fetchPostOnScroll = () => {
    setIndex((prev) => prev + 1);
  };

  const handleViewReport = (report: ReportType[]) => {
    setReport(report);
    setShowModal(true);
  };


  const handleTooglrPostStatus = async (postId: string) => {
    try {
      await adminApi.hideUnhidePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isHidden: !post.isHidden } : post
        )
      );
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="m-5 mt-32 flex mb-10 flex-col sm:flex-row sm:flex-wrap gap-10 justify-around">
        <div className="w-full sm:w-60 h-40 text-2xl bg-custom-blue py-10 text-white rounded-lg flex flex-col justify-center items-center">
          <p>Total Posts</p>
          <small>{totalPosts}</small>
        </div>

        <div className="w-full sm:w-60 h-40 text-2xl bg-custom-blue py-10 text-white rounded-lg flex flex-col justify-center items-center">
          <p>Total Reports</p>
          <small>{totalReports.length}</small>
        </div>
      </div>

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostOnScroll}
        hasMore={hasMore}
        loader={<></>}
        endMessage={<></>}
        scrollableTarget="scrollableDiv"
      >
        <div className="flex s justify-center">
          <div className="w-full  lg:w-4/5">
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {posts.length > 0 &&
                posts.map((post) => {
                  const hasReports =
                    totalReports &&
                    totalReports.filter((report) => report.postId === post._id);
                  return (
                    <div
                      key={post._id}
                      className="w-full border border-custom-blue p-5 flex flex-col justify-between items-center mb-10 relative"
                    >
                      <div className="flex items-center mb-3 p-2 w-full">
                        {post.postedUser.profile.image ? (
                          <img
                            className="w-10 h-8 mr-4 rounded-full"
                            src={post.postedUser.profile.image}
                            alt="User avatar"
                          />
                        ) : (
                          <Avatar
                            name={post.postedUser.username.slice(1)}
                            className="rounded-full me-4"
                            size="35"
                          />
                        )}
                        <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
                          <h3 className="text-base md:text-lg font-semibold">
                            {post.postedUser.username}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 md:mt-0">
                            {FormattedRelativeTime(post.createdAt)}
                          </p>
                        </div>
                      </div>

                      {post.image?.length > 0 ? (
                        <Contents content={post.image} />
                      ) : (
                        <p className="font-bold">No image</p>
                      )}
                      <div className="w-full flex items-center mt-2 p-2 md:p-0 sm:text-sm font-light md:font-normal break-words">
                        <p className="text-wrap w-full">{post.description}</p>
                      </div>

                      <div className="flex gap-5">
                        <button  onClick={()=>handleTooglrPostStatus(post._id)} className={` ${post.isHidden?'bg-green-600':"bg-red-600"} px-2 py-1 text-white rounded-lg text-sm`}>
                          {post.isHidden?'UNHIDE':"HIDE"}
                        </button>
                        {hasReports.length > 0 && (
                          <button
                            onClick={() => handleViewReport(hasReports)}
                            className="bg-custom-blue px-2 py-1  text-white rounded-lg text-sm"
                          >
                            View Reports
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </InfiniteScroll>
      {showModal && (
        <div
          id="modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative pb-5 rounded-lg shadow  text-white bg-custom-blue h-auto">
              <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
                <h2 className="pt-5 text-xl">Post Reports</h2>

                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 md:p-5">
                {report.length > 0 &&
                  report.map((report) => (
                    <ul className="list-disc p-3">
                      <li className="border p-3">{report.reason}</li>
                    </ul>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Posts;
