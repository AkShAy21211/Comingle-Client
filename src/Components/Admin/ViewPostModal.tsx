import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PostsType } from "../../Interface/interface";
import adminApi from "../../Apis/admin";
import AlertModal from "../Common/AlertModal";
import Slider from "react-slick";
import FormattedRelativeTime from "../../Utils/Time";

type ViewPostsModalProps = {
  selectedPost: PostsType;
  setPosts: Dispatch<SetStateAction<PostsType[]>>;
  setSelectedPost: Dispatch<SetStateAction<PostsType | null>>;
};
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};
function ViewPostsModal({
  selectedPost,
  setSelectedPost,
  setPosts,
}: ViewPostsModalProps) {
  const [postStatus, setPostStatus] = useState(selectedPost?.isHidden);
  const [showAlert, setShoAlert] = useState(false);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalCommetnts, setTOtalCommetnts] = useState<number>(0);

  const handleTooglrPostStatus = async () => {
    try {
      await adminApi.hideUnhidePost(selectedPost?._id as string);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === selectedPost?._id
            ? { ...post, isHidden: !post.isHidden }
            : post
        )
      );
      setPostStatus(!postStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const getPostReaction = async () => {
    try {
      const response = await adminApi.getPostReactions(selectedPost._id);

     
      const likes = response.likes?response.likes.length:0;
      const commets = response.comments?response.comments.comment.length:0;

      if (response) {
        setTotalLikes(likes);
        setTOtalCommetnts(commets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostReaction();
  }, []);
  return (
    <>
      <div
        id="modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full "
      >
        <div className="relative p-4 w-full max-w-md  ">
          {/* Modal content */}
          <div className="relative   rounded-lg  bg-gray-200  shadow-xl border mt-20 h-auto mb-20 pb-2">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5  rounded-t dark:border-gray-600">
              <button
                onClick={() => setSelectedPost(null)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <div className="p-4 md:p-5">
                {selectedPost?.image?.length > 1 ? (
                  <div className="w-full h-full">
                    <Slider {...settings}>
                      {selectedPost?.image.map((content, index) => (
                        <div key={index}>
                          {content.type === "image" ? (
                            <>
                              <img
                                src={content.url}
                                alt={`Image ${index}`}
                                className="object-cover w-full h-full"
                              />
                            </>
                          ) : (
                            <>
                              <video
                                controls
                                autoPlay
                                src={content.url}
                              ></video>
                            </>
                          )}
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) :selectedPost.image.length? (
                  <div className="w-full h-full">
                    {selectedPost?.image[0]?.type === "image" ? (
                      <>
                        <img
                          src={selectedPost?.image[0].url}
                          alt="Image"
                          className="object-cover w-full h-72"
                        />
                      </>
                    ) : (
                      <>
                        <video
                          src={selectedPost?.image[0]?.url}
                          controls
                          autoPlay
                        ></video>
                      </>
                    )}
                  </div>
                ):<p>{selectedPost.description}</p>}
              </div>
              <div className="p-5 flex gap-5 flex-wrap w-full">
                <p className="bg-gray-300 p-2  text-xs rounded-lg">
                  <b>By:</b> {selectedPost.postedUser.username}
                </p>
                <p className="bg-gray-300 p-2  text-xs rounded-lg">
                  <b>No, of contents: </b>
                  {selectedPost.image.length}
                </p>
                <p className="bg-gray-300 p-2  text-xs rounded-lg">
                  <b>Likes: </b>
                  {totalLikes}
                </p>
                <p className="bg-gray-300 p-2  text-xs rounded-lg">
                  <b>Commetns: </b>
                  {totalCommetnts}
                </p>
                <p className="bg-gray-300 p-2  text-xs rounded-lg">
                  <b>Posted date:</b>{" "}
                  {FormattedRelativeTime(selectedPost.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 ">
              <button
                onClick={() => setShoAlert(true)}
                className={` ${
                  postStatus ? "bg-green-500" : "bg-red-600"
                } px-10 py-1 text-white rounded-lg`}
              >
                {postStatus ? "UNHIDE" : "HIDE"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertModal
          setShowAlert={setShoAlert}
          handleTooglePostStatus={handleTooglrPostStatus}
        />
      )}
    </>
  );
}

export default ViewPostsModal;
