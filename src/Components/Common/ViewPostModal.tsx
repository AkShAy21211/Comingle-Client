import React, { useEffect, useState } from "react";
import { PostsType } from "../../Interface/interface";
import Slider from "react-slick";
import Avatar from "react-avatar";
import { IoMdHeartEmpty, IoMdSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { MdDelete } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";

type ViewPostModalProp = {
  selectedPost: PostsType | null;
  currentUserId: string;
  setNewComent: React.Dispatch<React.SetStateAction<string>>;
  handleNewComent: (postId: string, userId: string) => Promise<void>;
  newComment: string;
  newCommentError: {
    postId: string;
    error: string;
  };
  likePost: (postId: string, userId: string, authorId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  editComment: (
    commentId: string,
    postId: string,
    newComment: string
  ) => Promise<void>;
  setSelectedPost: React.Dispatch<React.SetStateAction<PostsType | null>>;
  setEditedComment: React.Dispatch<React.SetStateAction<string>>;
  editedCommentError: string;
  editedComment: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

function ViewPostModal({
  selectedPost,
  setReload,
  setSelectedPost,
  unlikePost,
  likePost,
  deleteComment,
  newComment,
  setNewComent,
  newCommentError,
  reload,
  editComment,
  handleNewComent,
  setEditedComment,
  editedCommentError,
  deletePost,
  editedComment,
  currentUserId,
}: ViewPostModalProp) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [editCommentDisabled, setEditCommentDisabled] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [showEditCommentDropDown, setShowEditCommentDropDown] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [showComments, setShowComments] = useState<boolean>(false); // State for toggling comments visibility

  const handleShowDropDown = async (commentId: string, status: boolean) => {
    try {
      setShowEditCommentDropDown({ _id: commentId, status: status });
      setEditCommentDisabled({ _id: commentId, status: status });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = (postId: string, userId: string, authorId: string) => {
    let post = selectedPost;

    post?.likes?.userId?.push(userId);

    setSelectedPost(post);

    likePost(postId, userId, authorId);
  };

  const handleUnlike = (postId: string, userId: string) => {
    setSelectedPost((post: PostsType | null) => {
      if (!post) return post;

      const hasLiked = post.likes.userId.includes(currentUserId);
      const updatedLikes = hasLiked
        ? post.likes.userId.filter((id) => id !== currentUserId)
        : [...post.likes.userId, currentUserId];

      return {
        ...post,
        likes: {
          ...post.likes,
          userId: updatedLikes,
        },
      };
    });

    unlikePost(postId, userId);
  };

  
  return (
    <div
      id="modal"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="relative w-full max-w-4xl mx-5 bg-gray-200 shadow-xl border rounded-lg overflow-auto-">
        {/* Modal content */}
        <div className="relative shadow-xl border">
          {/* Modal header */}
          <div className="flex justify-between p-4 rounded-t">
            {currentUser._id === selectedPost?.postedUser._id && (
              <MdDelete
                color="red"
                onClick={() => deletePost(selectedPost?._id as string)}
              />
            )}
            <button
              onClick={() => setSelectedPost(null)}
              type="button"
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
          <div className="p-4 md:p-5 flex flex-col md:flex-row">
            <div
              className={`w-full flex flex-col md:w-3/5 mb-4 md:mb-0 md:mr-4 ${
                showComments ? "hidden" : ""
              }`}
            >
              <>
                {selectedPost && selectedPost?.image.length > 1 ? (
                  <div className="w-full h-full">
                    <Slider {...settings}>
                      {selectedPost?.image.map((content, index) => (
                        <div key={index}>
                          {content.type === "image" ? (
                            <img
                              src={content.url}
                              alt={`Image ${index}`}
                              className="object-cover w-full h-96"
                            />
                          ) : (
                            <video
                              controls
                              autoPlay
                              className="object-cover w-full h-96"
                              src={content.url}
                            ></video>
                          )}
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {selectedPost?.image[0].type === "image" ? (
                      <img
                        src={selectedPost?.image[0].url}
                        alt="Image"
                        className="object-cover w-full h-96"
                      />
                    ) : (
                      <video
                        src={selectedPost?.image[0].url}
                        controls
                        className="object-cover w-full h-96"
                        autoPlay
                      ></video>
                    )}
                  </div>
                )}
                <p className="mt-2">{selectedPost?.description}</p>
              </>
              <div className="flex mt-5 gap-5">
                <div className="flex flex-col justify-center items-center">
                  <IoMdHeartEmpty
                    onClick={() =>
                      selectedPost?.likes?.userId?.includes(currentUserId)
                        ? handleUnlike(selectedPost._id, currentUserId)
                        : handleLike(
                            selectedPost?._id as string,
                            currentUserId,
                            selectedPost?.postedUser._id as string
                          )
                    }
                    className={
                      selectedPost?.likes?.userId?.includes(currentUserId)
                        ? "text-red-600"
                        : ""
                    }
                    size={30}
                  />
                  <p>{selectedPost?.likes?.userId?.length || 0}</p>
                </div>

                <div
                  className="flex flex-col justify-center items-center"
                  onClick={() => setShowComments(!showComments)} // Toggle comments visibility
                >
                  <FaRegComment size={25} />
                  <p>{selectedPost?.comments?.length || 0}</p>
                </div>
              </div>
            </div>

            <div
              className={`w-full md:w-2/5 flex flex-col transition-all duration-300 ${
                showComments ? "max-h-full" : "max-h-0 overflow-hidden"
              } md:max-h-full`} // Conditionally render the comments section
            >
              <div className="flex justify-start gap-3">
                <input
                  value={newComment}
                  onChange={(e) => setNewComent(e.target.value)}
                  type="text"
                  className={`${
                    isDarkMode ? "bg-gray-950" : "bg-gray-200"
                  } h-8 placeholder:text-sm w-full focus:outline-none border border-black px-4 rounded-full mb-2 md:mb-4`}
                  placeholder="Add a comment..."
                />
                <span className="p-1">
                  <IoMdSend
                    onClick={() =>
                      handleNewComent(
                        selectedPost?._id as string,
                        currentUserId
                      )
                    }
                    size={23}
                  />
                </span>
              </div>
              {newCommentError.error &&
                newCommentError.postId === (selectedPost?._id as string) && (
                  <p className="text-red-500 text-sm px-4 -mt-2">
                    {newCommentError.error}
                  </p>
                )}
              <div className="flex flex-col w-full mt-4 overflow-y-auto mb-20 h-80">
                {selectedPost?.comments?.map(
                  (comment) =>
                    comment._id && (
                      <div
                        key={comment._id}
                        className="flex gap-3 mb-2 relative"
                      >
                        {comment?.commenterImage ? (
                          <img
                            className="w-5 h-5 rounded-full"
                            src={comment?.commenterImage}
                            alt=""
                          />
                        ) : (
                          <Avatar
                            name={comment?.commenter && comment?.commenter}
                          />
                        )}
                        <div className="flex flex-col w-full overflow-y-auto break-words ">
                          <p className="font-bold">{comment?.commenter}</p>
                          <input
                            disabled={
                              editCommentDisabled._id === comment._id
                                ? false
                                : true
                            }
                            defaultValue={comment?.comment}
                            onChange={(e) =>
                              setEditedComment(e.target.value.trim())
                            }
                            className="text-sm p-1 rounded-xl focus:border focus:border-gray-500  mt-2 w-full border-b-2"
                          />
                          <p className="text-sm text-red-600">
                            {editCommentDisabled._id === comment._id &&
                              editedCommentError}
                          </p>
                        </div>
                        {comment.commentedUserId === currentUserId && (
                          <HiOutlineDotsVertical
                            onClick={() => {
                              handleShowDropDown(comment._id, false);
                              setEditCommentDisabled({ _id: "", status: true });
                            }}
                          />
                        )}
                        {showEditCommentDropDown._id === comment._id && (
                          <ul className="flex flex-col gap-2 bg-gray-300 rounded-xl p-2 absolute right-0 top-8 z-10">
                            <li>
                              <IoMdClose
                                onClick={() => handleShowDropDown("", true)}
                                className="float-right cursor-pointer"
                              />
                            </li>
                            <li>
                              {editCommentDisabled.status ? (
                                <MdEdit
                                  onClick={() =>
                                    setEditCommentDisabled({
                                      _id: comment._id,
                                      status: false,
                                    })
                                  }
                                />
                              ) : (
                                <IoSend
                                  size={15}
                                  onClick={() =>
                                    editComment(
                                      comment._id,
                                      selectedPost._id,
                                      editedComment
                                    )
                                  }
                                />
                              )}
                            </li>
                            <li>
                              <MdDelete
                                onClick={() =>
                                  deleteComment(selectedPost._id, comment._id)
                                }
                              />{" "}
                            </li>
                          </ul>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPostModal;
