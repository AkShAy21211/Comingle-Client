import React, { useEffect, useState } from "react";
import { Comment, PostsType } from "../../Interface/interface";
import { IoMdClose, IoMdHeartEmpty, IoMdSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend } from "react-icons/io5";

type ViewTextPostModalProp = {
  selectedPost: PostsType | null;
  currentUserId: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  likePost: (postId: string, userId: string, authorId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  setNewComent: React.Dispatch<React.SetStateAction<string>>;
  handleNewComent: (postId: string, userId: string) => Promise<void>;
  newComment: string;
  newCommentError: {
    postId: string;
    error: string;
  };
  editedCommentError: string;
  setEditedComment: React.Dispatch<React.SetStateAction<string>>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  editedComment: string;
  editComment: (
    commentId: string,
    postId: string,
    newComment: string
  ) => Promise<void>;
  setSelectedPost: React.Dispatch<React.SetStateAction<PostsType | null>>;
};

function ViewTextPostModal({
  selectedPost,
  editedComment,
  setReload,
  likePost,
  unlikePost,
  setEditedComment,
  editedCommentError,
  setNewComent,
  deletePost,
  currentUserId,
  deleteComment,
  reload,
  editComment,
  handleNewComent,
  newComment,
  newCommentError,
  setSelectedPost,
}: ViewTextPostModalProp) {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [showEditCommentDropDown, setShowEditCommentDropDown] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [editCommentDisabled, setEditCommentDisabled] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });

  const handleEditComment = async (commentId: string, status: boolean) => {
    try {
      setShowEditCommentDropDown({ _id: commentId, status: status });
      setEditCommentDisabled({ _id: commentId, status: status });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = (postId: string, userId: string, authorId: string) => {
    let post = selectedPost;

    post?.likes?.userId?.push(currentUser._id);

    setSelectedPost(post);

    likePost(postId, userId, authorId);
  };

  const handleUnlike = (postId: string, userId: string) => {
    setSelectedPost((post: PostsType | null) => {
      if (!post) return post;

      const hasLiked = post.likes.userId.includes(currentUser._id);
      const updatedLikes = hasLiked
        ? post.likes.userId.filter((id) => id !== currentUser._id)
        : [...post.likes.userId, currentUser._id];

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
    <div id="modal" aria-hidden="true" className="fixed inset-0 z-50">
      <div className="grid grid-cols-12 m-5 md:m-0">
        {/* Modal content */}
        <div className="relative col-span-full md:col-start-2 md:col-span-10 lg:col-start-5 lg:col-span-4 rounded-lg bg-gray-200 shadow-xl border mt-20 ">
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

          <div className="p-4 md:p-5 flex break-words w-full">
            <p className="text-wrap break-words w-full">
              {selectedPost?.description}
            </p>
          </div>

          <div className="flex flex-col w-full p-5 mt-4 overflow-y-auto h-64">
            {selectedPost?.comments?.map(
              (comment) =>
                comment._id && (
                  <div key={comment._id} className="flex gap-3 mb-2 relative">
                    {comment?.commenterImage ? (
                      <img
                        className="w-5 h-5 rounded-full"
                        src={comment?.commenterImage}
                        alt=""
                      />
                    ) : (
                      <Avatar name={comment?.commenter && comment?.commenter} />
                    )}
                    <div className="flex flex-col w-full overflow-y-auto break-words ">
                      <p className="font-bold">{comment?.commenter}</p>
                      <input
                        disabled={
                          editCommentDisabled._id === comment._id ? false : true
                        }
                        onChange={(e) =>
                          setEditedComment(e.target.value.trim())
                        }
                        defaultValue={comment?.comment}
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
                          handleEditComment(comment._id, true);
                          setEditCommentDisabled({ _id: "", status: true });
                        }}
                      />
                    )}
                    {showEditCommentDropDown._id === comment._id &&
                      showEditCommentDropDown.status && (
                        <ul className="flex flex-col gap-2 bg-gray-300 rounded-xl p-2 absolute right-0 top-8 z-10">
                          <li>
                            <IoMdClose
                              onClick={() => handleEditComment("", false)}
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

          <div className="p-4 md:p-5 flex">
            <div className="w-full h-full">
              <div className="flex mt-5 gap-5">
                <div className="flex gap-3">
                  <div className="flex flex-col justify-center items-center">
                    <IoMdHeartEmpty
                      onClick={() =>
                        selectedPost?.likes?.userId?.includes(currentUser._id)
                          ? handleUnlike(selectedPost._id, currentUser._id)
                          : handleLike(
                              selectedPost?._id as string,
                              currentUser._id,
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

                  <div className="flex flex-col justify-center items-center">
                    <FaRegComment size={25} />
                    <p>{selectedPost?.comments?.length || 0}</p>
                  </div>
                </div>
                <div className="flex justify-start gap-3">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComent(e.target.value)}
                    type="text"
                    className={`${
                      isDarkMode ? "bg-gray-950" : "bg-gray-200"
                    } h-8 placeholder:text-sm w-44 md:w-full focus:outline-none border border-black px-4 rounded-full`}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTextPostModal;
