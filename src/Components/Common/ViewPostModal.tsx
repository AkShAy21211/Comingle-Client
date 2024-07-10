import React, { useState } from "react";
import { PostsType } from "../../Interface/interface";
import Slider from "react-slick";
import Avatar from "react-avatar";
import { IoMdHeartEmpty, IoMdSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { MdDelete, MdVerified } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";

type ViewPostModalProp = {
  selectedPost: PostsType | null;
  currentUserId: string;
  handlePostEdit: (postId: string, text: string) => Promise<void>;
  setNewComent: React.Dispatch<React.SetStateAction<string>>;
  handleNewComent: (postId: string, userId: string,authorId:string) => Promise<void>;
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
  setSelectedPost,
  unlikePost,
  likePost,
  deleteComment,
  newComment,
  setNewComent,
  newCommentError,
  handlePostEdit,
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
  const [showEdit, setShowEdit] = useState(false);
  const [editPost, setEditPost] = useState(true);
  const [caption, setCaption] = useState("");

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
      className="fixed inset-0 z-50 flex items-center max-h-auto justify-center"
    >
      <div
        className={`relative w-full max-w-4xl mx-5 shadow-xl h-auto ${
          isDarkMode ? " backdrop-blur-lg bg-black/60" : "bg-gray-200"
        }   rounded-lg overflow-auto-`}
      >
        {/* Modal content */}
        <div className="relative shadow-xl border">
          {/* Modal header */}
          <div className="flex justify-between p-4 rounded-t">
            {currentUser._id === selectedPost?.postedUser._id && (
              <>
                <HiOutlineDotsVertical onClick={() => setShowEdit(!showEdit)} />

                {showEdit && (
                  <ul className="absolute left-10 border p-1 rounded-lg">
                    <li
                      onClick={() => deletePost(selectedPost?._id as string)}
                      className="flex gap-1  cursor-pointer"
                    >
                      <MdDelete className="mt-1" />
                    </li>
                    <li
                      onClick={() => setEditPost(!editPost)}
                      className="flex gap-1   cursor-pointer"
                    >
                      <MdEdit className="mt-3" />
                    </li>
                  </ul>
                )}
              </>
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
                              className=" w-full max-h-[75vh]"
                            />
                          ) : (
                            <video
                              controls
                              autoPlay
                              className=" w-full max-h-[75vh]"
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
                        className=" w-full max-h-[70vh]"
                      />
                    ) : (
                      <video
                        src={selectedPost?.image[0].url}
                        controls
                        className=" w-full max-h-[75vh]"
                        autoPlay
                      ></video>
                    )}
                  </div>
                )}
                <div className="flex break-words w-full">
                  <input
                    onChange={(e) => setCaption(e.target.value)}
                    defaultValue={selectedPost?.description || ""}
                    disabled={editPost}
                    className={`text-wrap ${
                      !editPost ? "border border-gray-200" : ""
                    }  ${
                      isDarkMode ? "bg-transparent text-white" : "border-gray-500 text-black"
                    } rounded-lg px-1 mt-5 break-words w-full`}
                  />
                  {!editPost && (
                    <IoSend
                      onClick={() =>
                        handlePostEdit(selectedPost?._id as string, caption)
                      }
                      className="mt-6 mx-1"
                    />
                  )}
                </div>
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
                  <p>{selectedPost?.comments[0].comment?selectedPost?.comments.length: 0}</p>
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
                        currentUserId,
                        selectedPost?.postedUser._id as string
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
                            size="23"
                            className="rounded-full"
                            name={comment?.commenter.slice(0)}
                          />
                        )}
                        <div className="flex flex-col w-full overflow-y-auto break-words ">
                          <p className="font-bold flex gap-1">
                            {comment?.commenter}
                            {comment.isPremium ? (
                              <MdVerified className="text-blue-600 mt-1" />
                            ) : (
                              ""
                            )}
                          </p>
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
                            className={`text-sm p-1 rounded-xl border  ${isDarkMode?"bg-black":"bg-gray-200"}  mt-2 w-full border-b-2`}
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
                            <ul className={`flex flex-col gap-2 ${isDarkMode?"bg-gray-900":' bg-gray-300'} rounded-xl p-2 relative right-0 top-8 z-10`}>
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
