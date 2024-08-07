import { IoMdClose, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState, useRef, useCallback } from "react";
import { Likes, PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import Avatar from "react-avatar";
import { IoMdSend } from "react-icons/io";
import { MdDelete, MdVerified } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ReportModal from "../../Components/User/ReportModal";
import Contents from "../../Components/User/Contets";

function SinglePost() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [post, setPosts] = useState<PostsType | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showComment, setShowComment] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState<{
    [key: string]: number;
  }>({});
  const [showEditCommentDropDown, setShowEditCommentDropDown] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [newComment, setNewComment] = useState<string>("");
  const [commetError, setCommentError] = useState<{
    postId: string;
    error: string;
  }>({ postId: "", error: "" });
  const [editCommentDisabled, setEditCommentDisabled] = useState<{
    _id: string;
    status: boolean;
  }>({ _id: "", status: true });
  const [editCommentError, setEditCommentError] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const { id } = useParams();

  //////////////////////    HANDLE FETCTCH POST ON FIRST VISIT ////////////////////////

  const fetchPost = useCallback(async () => {
    try {
      const getPosts = await userApi.getSinglePost(id as string);
      if (getPosts) {
        
        setPosts(getPosts.post[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
   
      fetchPost();
    
  }, [id]);

  /////////////////////////// HANDLE POST REPORT //////////////////////////

  const handleDropdownToggle = (postId: string) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  //////////////////////// HANDLE USER LIKE POST //////////////////////////

  const likePost = useCallback(
    async (postId: string, userId: string, authorId: string) => {
      try {
        const likeResponse = await userApi.likePost(postId, userId, authorId);
        console.log("like", likeResponse);

        if (likeResponse) {
          setPosts((prevPost: PostsType | null) => {
            if (!prevPost) return prevPost;
            const newLike: Likes = likeResponse.likes;
            return {
              ...prevPost,
              likes: newLike,
            };
          });

          console.log(post);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [post]
  );

  //////////////////////// HANDLE USER UNLIKE POST //////////////////////////

  const unLikePost = useCallback(
    async (postId: string, userId: string) => {
      try {
        const likeResponse = await userApi.unLikePost(postId, userId);
        if (likeResponse) {
          setPosts((prevPost: PostsType | null) => {
            if (!prevPost) return prevPost;
            const newLike: Likes = likeResponse.likes;
            return {
              ...prevPost,
              likes: newLike,
            };
          });

          console.log(post);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [post]
  );



  const handleCommentShow = async (postId: string) => {
    setShowComment(showComment === postId ? null : postId);
  };

  // Function to handle "Show More" comments
  const handleShowMoreComments = (postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 2) + 2,
    }));
  };

  ///////////////// HANDLE NEW COMMETN BY USER TO POSTS ////////////////////

  const handleCommentSubmit = async (postId: string, userId: string) => {
    if (!newComment.trim()) {
      setCommentError({ postId: postId, error: "Enter a comment" });
      return;
    }
    setCommentError({ postId: "", error: "" });

    try {
      const commentResponse = await userApi.commentPost(
        newComment,
        postId,
        userId,
        post?.postedUser._id as string
      );
      if (commentResponse) {
        setPosts((prevPost: PostsType | null) => {
          if (!prevPost) return prevPost;

          return {
            ...prevPost,
            likes: commentResponse,
          };
        });

        console.log(post);
      }
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////////// HANDLE POST REPORT //////////////////////////////////
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitReport = async (reason: string) => {
    await userApi.reportPost(postId, reason);

    console.log(postId, reason);
    setModalOpen(false);
  };

  ///////////////////// HANDLE DELETE COMMETNT /////////////////////////////////

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await userApi.deleteComment(postId, commentId);

      setPosts((prevPost: PostsType | null) => {
        if (!prevPost) return prevPost;

        if (prevPost._id === postId) {
          return {
            ...prevPost,
            comments: prevPost.comments.filter(
              (comment) => comment._id !== commentId
            ),
          };
        }
        return prevPost;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //////////////////// HANDLE EDIT COMMENT /////////////////////////////////

  const handleShowDropDown = async (commentId: string, status: boolean) => {
    try {
      setShowEditCommentDropDown({ _id: commentId, status: status });
      setEditCommentDisabled({ _id: commentId, status: status });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async (postId: string, commentId: string) => {
    if (!editedComment.trim()) {
      setEditCommentError("Comment should be atleast one character");
      return;
    }
    try {
      setEditCommentError("");
      await userApi.editComment(postId, commentId, editedComment);

      setEditedComment("");
      setEditCommentDisabled({ _id: "", status: true });
    } catch (error) {
      setEditedComment("");

      setEditCommentError("");
      console.log(error);
    }
  };
  console.log("dddddddddddddddddddddddd", post);

  return (
    <div
      className={` mt-16 pt-1 lg:mt-0 ${
        isDarkMode ? "bg-black text-white" : ""
      } col-span-full   overflow-auto h-svh lg:col-start-2 lg:col-end-5`}
      id="scrollableDiv"
    >
      <div className="flex justify-center">
        <div className="w-full lg:w-3/5">
          {post && (
            <div
              key={post._id}
              className={`w-full ${
                isDarkMode ? "bg-black text-white" : ""
              } flex flex-col justify-between items-center mb-10 mt-32 relative`}
            >
              <div className="flex items-center mb-3 p-2 w-full">
                {post.postedUser?.profile?.image ? (
                  <img
                    onClick={() =>
                      currentUser._id === post.postedUser._id
                        ? navigate("/profile")
                        : navigate(`/profile/${post?.postedUser?.username}`)
                    }
                    className="w-10 h-9 mr-4 cursor-pointer rounded-full"
                    src={post?.postedUser?.profile?.image}
                  />
                ) : (
                  <Avatar
                    onClick={() =>
                      currentUser._id === post?.postedUser?._id
                        ? navigate("/profile")
                        : navigate(`/profile/${post?.postedUser?.username}`)
                    }
                    name={post?.postedUser?.username.slice(1)}
                    className="rounded-full me-4 cursor-pointer"
                    size="35"
                  />
                )}
                <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
                  <div
                    onClick={() =>
                      currentUser._id === post.postedUser._id
                        ? navigate("/profile")
                        : navigate(`/profile/${post?.postedUser?.username}`)
                    }
                    className="text-base cursor-pointer md:text-lg font-semibold flex gap-3"
                  >
                    <p>{post?.postedUser?.username}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 md:mt-0 flex gap-2">
                    {/* {FormattedRelativeTime(post.createdAt)} */}
                  </div>
                </div>
                <div ref={dropdownRef}>
                  <HiOutlineDotsVertical
                    className="ml-1 cursor-pointer"
                    size={20}
                    onClick={() => handleDropdownToggle(post._id)}
                  />
                  {showDropdown === post._id && (
                    <div
                      className={`absolute mt-2 right-0 z-10   shadow-lg  ${
                        isDarkMode ? "bg-neutral-950" : "bg-gray-200"
                      }  rounded-lg w-32`}
                    >
                      {post.postedUser._id !== currentUser._id && (
                        <ul className="py-2 space-y-3 text-sm">
                          <li className=""></li>
                          <li
                            onClick={handleOpenModal}
                            onMouseOver={() => {
                              handleOpenModal();
                              setPostId(post._id);
                            }}
                            className="mx-4 cursor-pointer "
                          >
                            <button>Report</button>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {post.image?.length > 0 && <Contents content={post} />}
              <div
                className={`w-full ${
                  isDarkMode ? "bg-black" : ""
                } flex items-center mt-2 p-2 md:p-0 sm:text-sm font-light md:font-normal break-words`}
              >
                <p className="text-wrap mx-2 w-full">{post.description}</p>
              </div>

              <div
                className={`w-full ${
                  isDarkMode ? "bg-black" : ""
                } flex justify-around gap-8 p-4`}
              >
                <div className="flex w-full gap-10">
                  <IoMdHeartEmpty
                    className={
                      post?.likes &&
                      post?.likes?.userId?.includes(currentUser._id)
                        ? `text-red-500`
                        : `${isDarkMode ? "text-white" : "text-black"}`
                    }
                    onClick={() => {
                      post?.likes &&
                      post?.likes?.userId?.length > 0 &&
                      post?.likes?.userId?.includes(currentUser._id)
                        ? unLikePost(post._id, currentUser._id)
                        : likePost(
                            post._id,
                            currentUser._id,
                            post.postedUser._id
                          );
                    }}
                    size={25}
                  />
                  <FaRegComment
                    size={20}
                    onClick={() => handleCommentShow(post._id)}
                  />

                  {/* SHARE POST */}
                  {/* <PiShareFatThin
                        onClick={() => handleCopyLink(post._id)}
                        size={25}
                        className="font-bold"
                      /> */}
                </div>

                {/* SAVE POST  */}
                {/* <CiSaveDown2 size={27} className="font-bold" /> */}
              </div>
              <div className="flex w-full px-4 gap-5">
                <p className="text-xs flex">
                  {post?.likes ? post?.likes?.userId?.length : 0} likes
                </p>
                <p className="text-xs flex">
                  {post?.comments ? post?.comments?.length : 0} comments
                </p>
              </div>
              {showComment === post._id && (
                <div
                  className={`w-full ${
                    isDarkMode ? "bg-black text-white" : ""
                  } ${
                    showComment ? "h-auto " : "h-full"
                  } transition-all duration-500 ease-in-out flex flex-col`}
                >
                  <div className="w-full px-4">
                    <div className="mt-4">
                      {post.comments.length > 0 &&
                        post.comments[0].comment &&
                        post.comments
                          .slice(0, visibleComments[post._id] || 2)
                          .map((comment, index) => (
                            <div
                              key={index}
                              className="flex items-center  mb-2 "
                            >
                              {comment.commenterImage ? (
                                <img
                                  className="w-7 h-7 rounded-full me-4"
                                  src={comment.commenterImage}
                                  alt=""
                                />
                              ) : (
                                <Avatar
                                  name={comment.commenter.slice(1)}
                                  className="rounded-full me-4"
                                  size="28"
                                />
                              )}
                              <div className="flex flex-col break-words w-80 md:w-96">
                                <p className="text-sm font-semibold  text-wrap flex gap-1">
                                  {comment.commenter}
                                  {comment.isPremium ? (
                                    <MdVerified className="text-blue-600 mt-1" />
                                  ) : (
                                    ""
                                  )}
                                </p>
                                {/* <p className="text-xs">{comment.comment}</p> */}
                                <div className="flex flex-col">
                                  <input
                                    className={`${
                                      editCommentDisabled._id === comment._id &&
                                      "border  border-gray-300 mx-1 p-1 rounded-full"
                                    }`}
                                    onChange={(e) =>
                                      setEditedComment(e.target.value)
                                    }
                                    type="text"
                                    defaultValue={comment.comment}
                                    disabled={
                                      editCommentDisabled._id === comment._id
                                        ? false
                                        : true
                                    }
                                  />
                                  {editCommentError.trim() &&
                                    editCommentDisabled._id === comment._id && (
                                      <p className="text-red-600 text-xs">
                                        {editCommentError}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {comment.commentedUserId == currentUser._id && (
                                <div className="flex gap-1 mt-4">
                                  <HiOutlineDotsVertical
                                    onClick={() => {
                                      handleShowDropDown(comment._id, false);
                                      setEditCommentDisabled({
                                        _id: "",
                                        status: true,
                                      });
                                    }}
                                  />
                                </div>
                              )}
                              {showEditCommentDropDown._id === comment._id && (
                                <ul className="flex flex-col gap-2 bg-gray-300 rounded-xl p-2 relative right-0 top-8 z-10">
                                  <li>
                                    <IoMdClose
                                      onClick={() =>
                                        handleShowDropDown("", true)
                                      }
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
                                          handleEditComment(
                                            post._id,
                                            comment._id
                                          )
                                        }
                                      />
                                    )}
                                  </li>
                                  <li>
                                    <MdDelete
                                      onClick={() =>
                                        handleDeleteComment(
                                          post._id,
                                          comment._id
                                        )
                                      }
                                    />{" "}
                                  </li>
                                </ul>
                              )}
                            </div>
                          ))}
                    </div>
                    {post.comments.length >
                      (visibleComments[post._id] || 2) && (
                      <button
                        className="text-xs text-blue-500 mt-2"
                        onClick={() => handleShowMoreComments(post._id)}
                      >
                        Show more
                      </button>
                    )}
                  </div>
                  <div className="flex justify-start p-4 gap-3">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      type="text"
                      className={`${
                        isDarkMode ? "bg-gray-950" : "bg-gray-200"
                      } w-80 md:w-96 h-10 p-3 rounded-full`}
                      placeholder="Add a comment..."
                    />
                    <span className="p-3">
                      <IoMdSend
                        onClick={() =>
                          handleCommentSubmit(post._id, currentUser._id)
                        }
                        size={23}
                      />
                    </span>
                  </div>
                  {commetError.error && commetError.postId === post._id && (
                    <p className="text-red-500 text-sm px-4 -mt-2">
                      {commetError.error}
                    </p>
                  )}
                  <button
                    className="text-xs text-blue-500 mt-2"
                    onClick={() => setShowComment(null)}
                  >
                    hide
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}

export default SinglePost;
