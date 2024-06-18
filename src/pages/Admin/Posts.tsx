import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import FormattedRelativeTime from "../../Utils/Time";
import adminApi from "../../Apis/admin";
import { PostsType, ReportType } from "../../Interface/interface";
import { FaEye } from "react-icons/fa";
import Slider from "react-slick";
import ViewPostsModal from "../../Components/Admin/ViewPostModal";

function Posts() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [totalReports, setTotalReport] = useState<ReportType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState<ReportType[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostsType | null>(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const getPosts = async () => {
    try {
      const response = await adminApi.getAllPosts(0);
      if (response) {
        setPosts(response.posts);
        setTotalPosts((prev) => prev + response.posts.length);
        setTotalReport(response.retports);
        setReport(response.retports);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleViewReport = (report: ReportType[]) => {
    setReport(report);
    setShowModal(true);
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

      <div className="flex flex-col lg:px-20 pt-20">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="flex justify-between w-full px-2 ">
              <input
                type="text"
                placeholder="Search......"
                className="placeholder:text-sm p-2 h-8 border border-custom-blue w-72 rounded-lg mb-5"
              />
              <p className="bg-custom-teal shadow-xl flex justify-center items-center text-sm p-2 text-white rounded-lg mb-5">
                Total {posts.length}
              </p>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg h-[75vh]">
              <div className="overflow-y-auto h-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Posts
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reports
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                      >
                        {/* Action */}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => {
                      const postReport = report.filter(
                        (r) => r.postId === post._id
                      );

                      return (
                        <tr className="hover:bg-gray-200" key={post._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {post.image.length > 1 ? (
                                  <div className="w-full h-full">
                                    <Slider {...settings}>
                                      {post.image.map((content, index) => (
                                        <div key={index}>
                                          {content.type === "image" ? (
                                            <>
                                              <img
                                                src={content.url}
                                                alt={`Image ${index}`}
                                                className="object-cover w-full h-full"
                                              />
                                              <span className="text-xs">
                                                {content.type}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <video
                                                controls
                                                autoPlay
                                                src={content.url}
                                              ></video>
                                              <span className="text-xs">
                                                {content.type}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      ))}
                                    </Slider>
                                  </div>
                                ) : (
                                  <div className="w-full h-full">
                                    {post.image[0].type === "image" ? (
                                      <>
                                        <img
                                          src={post.image[0].url}
                                          alt="Image"
                                          className="object-cover w-full h-full"
                                        />
                                        <span className="text-xs">
                                          {post.image[0].type}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <video
                                          src={post.image[0].url}
                                          controls
                                          autoPlay
                                        ></video>
                                        <span className="text-xs">
                                          {post.image[0].type}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              {post.postedUser.username}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              <FaEye
                                size={20}
                                onClick={() => handleViewReport(postReport)}
                                className="text-custom-blue cursor-pointer"
                              />
                              <small
                                className={`mx-2 ${
                                  postReport.length
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {postReport.length}
                              </small>
                            </span>
                          </td>
                          <td
                            className={`py-4 ${
                              post.isHidden
                                ? "text-red-600"
                                : "text-green-600"
                            } whitespace-nowrap text-sm flex justify-center text-center font-medium`}
                          >
                            {post.isHidden ? "Hidden" : "Active"}
                          </td>
                          <td
                            className={`py-4 ${
                              post.isHidden
                                ? "text-red-600"
                                : "text-green-600"
                            } whitespace-nowrap text-sm text-end font-medium`}
                          >
                            <FaEye
                              onClick={() => setSelectedPost(post)}
                              size={20}
                              className="float-end mx-10 text-custom-blue hover:animate-pulse cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          id="modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative pb-5 rounded-lg shadow bg-gray-200 h-auto">
              <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                <h2 className="pt-5 text-xl">Post Reports</h2>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
                {report.length ? (
                  report.map((report,i) => (
                    <ul className="list-disc p-3" key={i}>
                      <li className="border p-3">{report.reason}</li>
                    </ul>
                  ))
                ) : (
                  <p>No reports yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPost && (
        <ViewPostsModal
          setPosts={setPosts}
          setSelectedPost={setSelectedPost}
          selectedPost={selectedPost}
        />
      )}
    </>
  );
}

export default Posts;
