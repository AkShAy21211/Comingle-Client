import React, { useState } from "react";
import { PostsType } from "../../Interface/interface";
import { IoMdClose, IoMdHeartEmpty, IoMdSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { MdDelete, MdEdit, MdVerified } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend } from "react-icons/io5";

type ViewTextPostModalProp = {
  selectedPost: PostsType | null;
  currentUserId: string;
  handlePostEdit: (postId: string, text: string) => Promise<void>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  likePost: (postId: string, userId: string, authorId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
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
  likePost,
  handlePostEdit,
  unlikePost,
  setEditedComment,
  editedCommentError,
  setNewComent,
  deletePost,
  currentUserId,
  deleteComment,
  editComment,
  handleNewComent,
  newComment,
  newCommentError,
  setSelectedPost,
}: ViewTextPostModalProp) {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [caption, setCaption] = useState(selectedPost?.description || "");
  const [showEditCommentDropDown, setShowEditCommentDropDown] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [editCommentDisabled, setEditCommentDisabled] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [showEdit, setShowEdit] = useState(false);
  const [editPost, setEditPost] = useState(true);

  if (!selectedPost) return null;
  const likedUserIds = selectedPost.likes?.userId || [];
  const commentCount = selectedPost.comments?.[0]?.comment
    ? selectedPost.comments.length
    : 0;

  const handleEditCommentMenu = async (commentId: string, status: boolean) => {
    setShowEditCommentDropDown({ _id: commentId, status });
    setEditCommentDisabled({ _id: commentId, status });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/60 p-3 backdrop-blur-md sm:p-5">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-center">
        <div
          className={`flex h-full max-h-[92vh] w-full flex-col overflow-hidden rounded-[28px] border sm:rounded-[32px] ${
            isDarkMode
              ? "border-white/10 bg-slate-950 text-white"
              : "border-white/80 bg-white text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5">
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
            <div className="flex items-center gap-3">
              {currentUser._id === selectedPost.postedUser._id && (
                <div className="relative">
                  <button onClick={() => setShowEdit(!showEdit)}>
                    <HiOutlineDotsVertical size={20} />
                  </button>
                  {showEdit && (
                    <ul
                      className={`absolute right-0 top-8 flex min-w-[132px] flex-col gap-2 rounded-2xl border p-3 text-sm shadow-xl ${
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
                        Edit post
                      </li>
                    </ul>
                  )}
                </div>
              )}
              <button onClick={() => setSelectedPost(null)}>
                <IoMdClose size={24} />
              </button>
            </div>
          </div>

          <div className="border-b px-4 py-4 sm:px-5">
            <div className="flex break-words">
              <textarea
                onChange={(e) => setCaption(e.target.value)}
                defaultValue={selectedPost.description}
                disabled={editPost}
                rows={5}
                className={`w-full resize-none rounded-[24px] px-4 py-4 text-sm leading-7 sm:text-base ${
                  editPost ? "border-transparent" : "border"
                } ${
                  isDarkMode
                    ? "border-white/10 bg-slate-900"
                    : "border-slate-200 bg-slate-50"
                }`}
              />
              {!editPost && (
                <button
                  onClick={() => handlePostEdit(selectedPost._id, caption)}
                  className="ml-2 self-end rounded-full bg-custom-blue p-3 text-white"
                >
                  <IoSend />
                </button>
              )}
            </div>
          </div>

          <div className="border-b px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-6">
              <button
                className="flex flex-col items-center"
                onClick={() =>
                  likedUserIds.includes(currentUser._id)
                    ? unlikePost(selectedPost._id, currentUser._id)
                    : likePost(
                        selectedPost._id,
                        currentUser._id,
                        selectedPost.postedUser._id
                      )
                }
              >
                <IoMdHeartEmpty
                  size={28}
                  className={
                    likedUserIds.includes(currentUserId)
                      ? "text-red-600"
                      : ""
                  }
                />
                <p className="mt-1 text-sm app-muted">
                  {likedUserIds.length}
                </p>
              </button>

              <div className="flex flex-col items-center">
                <FaRegComment size={23} />
                <p className="mt-1 text-sm app-muted">{commentCount}</p>
              </div>
            </div>
          </div>

          <div className="border-b px-4 py-4 sm:px-5">
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
                          name={comment.commenter}
                          size="32"
                          className="rounded-full"
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
                          onChange={(e) =>
                            setEditedComment(e.target.value.trim())
                          }
                          defaultValue={comment.comment}
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
                            handleEditCommentMenu(comment._id, true);
                            setEditCommentDisabled({ _id: "", status: true });
                          }}
                        >
                          <HiOutlineDotsVertical />
                        </button>
                      )}
                      {showEditCommentDropDown._id === comment._id &&
                        showEditCommentDropDown.status && (
                          <ul
                            className={`absolute right-3 top-12 z-10 flex flex-col gap-2 rounded-2xl border p-3 ${
                              isDarkMode
                                ? "border-white/10 bg-slate-900"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <li>
                              <IoMdClose
                                onClick={() => handleEditCommentMenu("", false)}
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
  );
}

export default ViewTextPostModal;
