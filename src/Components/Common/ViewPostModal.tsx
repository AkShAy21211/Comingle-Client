import React, { useState } from "react";
import { PostsType } from "../../Interface/interface";
import Slider from "react-slick";
import Avatar from "react-avatar";
import { IoMdHeartEmpty, IoMdSend, IoMdClose } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { MdDelete, MdEdit, MdVerified } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend } from "react-icons/io5";

type ViewPostModalProp = {
  selectedPost: PostsType | null;
  currentUserId: string;
  handlePostEdit: (postId: string, text: string) => Promise<void>;
  setNewComent: React.Dispatch<React.SetStateAction<string>>;
  handleNewComent: (
    postId: string,
    userId: string,
    authorId: string
  ) => Promise<void>;
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
  const [showEdit, setShowEdit] = useState(false);
  const [editPost, setEditPost] = useState(true);
  const [caption, setCaption] = useState(selectedPost?.description || "");

  if (!selectedPost) return null;

  const likedUserIds = selectedPost.likes?.userId || [];
  const commentCount = selectedPost.comments?.[0]?.comment
    ? selectedPost.comments.length
    : 0;

  const handleShowDropDown = (commentId: string, status: boolean) => {
    setShowEditCommentDropDown({ _id: commentId, status });
    setEditCommentDisabled({ _id: commentId, status });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/70 p-3 backdrop-blur-md sm:p-5">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center">
        <div
          className={`grid h-full max-h-[92vh] w-full overflow-hidden rounded-[28px] border lg:grid-cols-[minmax(0,1.2fr)_390px] ${
            isDarkMode
              ? "border-white/10 bg-slate-950 text-white"
              : "border-white/80 bg-white text-slate-900"
          }`}
        >
          <div className={`min-h-0 border-b lg:border-b-0 lg:border-r ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  {selectedPost.postedUser.profile.image ? (
                    <img
                      src={selectedPost.postedUser.profile.image}
                      className="h-10 w-10 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <Avatar
                      name={selectedPost.postedUser.username}
                      size="40"
                      className="rounded-full"
                    />
                  )}
                  <p className="flex items-center gap-1 text-sm font-semibold sm:text-base">
                    {selectedPost.postedUser.username}
                  </p>
                </div>
                <button onClick={() => setSelectedPost(null)}>
                  <IoMdClose size={24} />
                </button>
              </div>

              <div className="min-h-0 flex-1 px-3 pb-3 sm:px-5 sm:pb-5">
                <div className="h-full overflow-hidden rounded-[24px] bg-slate-100/40">
                  {selectedPost.image.length > 1 ? (
                    <Slider {...settings}>
                      {selectedPost.image.map((content, index) => (
                        <div key={index}>
                          {content.type === "image" ? (
                            <img
                              src={content.url}
                              alt={`Image ${index}`}
                              className="h-[42vh] w-full object-cover sm:h-[56vh] lg:h-[82vh]"
                            />
                          ) : (
                            <video
                              controls
                              autoPlay
                              className="h-[42vh] w-full object-cover sm:h-[56vh] lg:h-[82vh]"
                              src={content.url}
                            ></video>
                          )}
                        </div>
                      ))}
                    </Slider>
                  ) : selectedPost.image[0]?.type === "image" ? (
                    <img
                      src={selectedPost.image[0].url}
                      alt="Post"
                      className="h-[42vh] w-full object-cover sm:h-[56vh] lg:h-[82vh]"
                    />
                  ) : (
                    <video
                      src={selectedPost.image[0]?.url}
                      controls
                      autoPlay
                      className="h-[42vh] w-full object-cover sm:h-[56vh] lg:h-[82vh]"
                    ></video>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0">
            <div className="flex h-full flex-col">
              <div className={`flex items-center justify-between border-b px-4 py-4 sm:px-5 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                <div className="relative">
                  {currentUser._id === selectedPost.postedUser._id && (
                    <>
                      <button onClick={() => setShowEdit(!showEdit)}>
                        <HiOutlineDotsVertical size={20} />
                      </button>
                      {showEdit && (
                        <ul
                          className={`absolute left-0 top-8 z-10 flex min-w-[140px] flex-col gap-2 rounded-2xl border p-3 text-sm shadow-xl ${
                            isDarkMode
                              ? "border-white/10 bg-slate-900"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <li
                            onClick={() => deletePost(selectedPost._id)}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <MdDelete />
                            Delete
                          </li>
                          <li
                            onClick={() => setEditPost(!editPost)}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <MdEdit />
                            Edit caption
                          </li>
                        </ul>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-5">
                  <button
                    className="flex flex-col items-center"
                    onClick={() =>
                      likedUserIds.includes(currentUserId)
                        ? unlikePost(selectedPost._id, currentUserId)
                        : likePost(
                            selectedPost._id,
                            currentUserId,
                            selectedPost.postedUser._id
                          )
                    }
                  >
                    <IoMdHeartEmpty
                      size={24}
                      className={likedUserIds.includes(currentUserId) ? "text-red-600" : ""}
                    />
                    <span className="mt-1 text-xs app-muted">{likedUserIds.length}</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <FaRegComment size={21} />
                    <span className="mt-1 text-xs app-muted">{commentCount}</span>
                  </div>
                </div>
              </div>

              <div className={`border-b px-4 py-4 sm:px-5 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    {editPost ? (
                      <p className="rounded-[20px] bg-slate-100/70 px-4 py-3 text-sm leading-7 sm:text-base dark:bg-white/5">
                        {selectedPost.description || "No caption"}
                      </p>
                    ) : (
                      <textarea
                        onChange={(e) => setCaption(e.target.value)}
                        defaultValue={selectedPost.description || ""}
                        rows={4}
                        className={`w-full resize-none rounded-[20px] border px-4 py-3 text-sm leading-7 sm:text-base ${
                          isDarkMode
                            ? "border-white/10 bg-slate-900 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-900"
                        }`}
                      />
                    )}
                  </div>
                  {!editPost && (
                    <button
                      onClick={() => handlePostEdit(selectedPost._id, caption)}
                      className="rounded-full bg-custom-blue p-3 text-white"
                    >
                      <IoSend />
                    </button>
                  )}
                </div>
              </div>

              <div className={`border-b px-4 py-4 sm:px-5 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                <div className="flex items-center gap-3">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComent(e.target.value)}
                    type="text"
                    className="app-input !h-11 !rounded-full !py-0"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={() =>
                      handleNewComent(
                        selectedPost._id,
                        currentUserId,
                        selectedPost.postedUser._id
                      )
                    }
                    className="rounded-full bg-custom-blue p-3 text-white"
                  >
                    <IoMdSend size={18} />
                  </button>
                </div>
                {newCommentError.error &&
                  newCommentError.postId === selectedPost._id && (
                    <p className="mt-2 text-sm text-red-500">
                      {newCommentError.error}
                    </p>
                  )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <div className="space-y-4">
                  {selectedPost.comments?.map(
                    (comment) =>
                      comment._id && (
                        <div
                          key={comment._id}
                          className={`relative flex gap-3 rounded-[22px] border p-3 ${
                            isDarkMode
                              ? "border-white/10 bg-white/5"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          {comment.commenterImage ? (
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={comment.commenterImage}
                              alt=""
                            />
                          ) : (
                            <Avatar
                              size="32"
                              className="rounded-full"
                              name={comment.commenter.slice(0)}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1 text-sm font-semibold">
                              {comment.commenter}
                              {comment.isPremium ? (
                                <MdVerified className="text-blue-600" />
                              ) : null}
                            </p>
                            <input
                              disabled={
                                editCommentDisabled._id === comment._id
                                  ? false
                                  : true
                              }
                              defaultValue={comment.comment}
                              onChange={(e) =>
                                setEditedComment(e.target.value.trim())
                              }
                              className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm ${
                                isDarkMode
                                  ? "border-white/10 bg-slate-950"
                                  : "border-slate-200 bg-white"
                              }`}
                            />
                            <p className="mt-1 text-sm text-red-600">
                              {editCommentDisabled._id === comment._id &&
                                editedCommentError}
                            </p>
                          </div>
                          {comment.commentedUserId === currentUserId && (
                            <button
                              onClick={() => {
                                handleShowDropDown(comment._id, false);
                                setEditCommentDisabled({
                                  _id: "",
                                  status: true,
                                });
                              }}
                            >
                              <HiOutlineDotsVertical />
                            </button>
                          )}
                          {showEditCommentDropDown._id === comment._id && (
                            <ul
                              className={`absolute right-3 top-12 z-10 flex flex-col gap-2 rounded-2xl border p-3 ${
                                isDarkMode
                                  ? "border-white/10 bg-slate-900"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <li>
                                <IoMdClose
                                  onClick={() => handleShowDropDown("", true)}
                                  className="cursor-pointer"
                                />
                              </li>
                              <li>
                                {editCommentDisabled.status ? (
                                  <MdEdit
                                    className="cursor-pointer"
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
                                    className="cursor-pointer"
                                    onClick={() =>
                                      editComment(
                                        comment._id,
                                        selectedPost._id,
                                        comment.comment
                                      )
                                    }
                                  />
                                )}
                              </li>
                              <li>
                                <MdDelete
                                  className="cursor-pointer"
                                  onClick={() =>
                                    deleteComment(selectedPost._id, comment._id)
                                  }
                                />
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
    </div>
  );
}

export default ViewPostModal;
