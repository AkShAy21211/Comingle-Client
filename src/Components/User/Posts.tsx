import { IoMdClose, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CreatePost from "./CreatePost";
import Contents from "./Contets";
import FormattedRelativeTime from "../../Utils/Time";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState, useRef, useCallback } from "react";
import { Likes, PostsType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import Avatar from "react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoMdSend } from "react-icons/io";
import ReportModal from "./ReportModal";
import { MdDelete, MdVerified } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { PiShareFatThin } from "react-icons/pi";
import { Bounce, toast } from "react-toastify";
import socket from "../../Apis/socket";

function Posts() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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
  const [fetchAgain, setFetchAgain] = useState(false);

  //////////////////////    HANDLE FETCTCH POST ON FIRST VISIT ////////////////////////

  const fetchAllPosts = async () => {
    try {
      const getPosts = await userApi.getAllPosts(0);
      if (getPosts) {
        setFetchAgain(false);
        setPosts(getPosts.posts);
        localStorage.setItem("posts", JSON.stringify(getPosts.posts));
        posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setHasMore(getPosts.posts.length > 0);
      }
    } catch (error: any) {
      console.log('err fetchin  gposts');
      
      console.log(error);
      
      const collections = localStorage.getItem("posts");
      const posts = collections ? JSON.parse(collections) : null;
      setPosts(posts);
    }
  };

  useEffect(() => {
    socket.emit("login", { userId: currentUser._id });

    return () => {
      socket.off("login");
    };
  }, [currentUser._id]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAgain]);

  /////////////////////////// HANDLE POST REPORT //////////////////////////

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (postId: string) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  /////////////// HANDLE FETCH POT ON SCROLL ///////////////////////////////

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

  //////////// FETCH NEXT SET OF POST ON SCROLL ///////////////////////////

  const fetchPostOnScroll = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (index > 0) {
      fetchPosts();
    }
  }, [index]);

  //////////////////////// HANDLE USER LIKE POST //////////////////////////

  const likePost = useCallback(
    async (postId: string, userId: string, authorId: string) => {
      try {
        const likeResponse = await userApi.likePost(postId, userId, authorId);
        


        if (likeResponse) {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post._id === postId) {
                const newLike: Likes = likeResponse.likes;
                return {
                  ...post,
                  likes: { ...post.likes, ...newLike },
                };
              }
              return post;
            })
          );
          socket.emit("notification",authorId)
        }
      } catch (error) {
        console.log(error);
      }
    },
    [posts]
  );

  //////////////////////// HANDLE USER UNLIKE POST //////////////////////////

  const unLikePost = useCallback(
    async (postId: string, userId: string) => {
      try {
        const likeResponse = await userApi.unLikePost(postId, userId);
        if (likeResponse) {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post._id === postId) {
                const newLike: Likes = likeResponse.likes;
                return {
                  ...post,
                  likes: { ...post.likes, ...newLike },
                };
              }
              return post;
            })
          );
          console.log(posts);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [posts]
  );

  const handleCopyLink = async (postId: string) => {
    const postUrl = `${window.location.origin}/post/${postId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Link copied", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } catch (error) {
        console.error("Failed to copy: ", error);
        toast.error("Failed to copy link", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  };

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
        userId
      );
      if (commentResponse) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                comments: [...post.comments, commentResponse],
              };
            }
            return post;
          })
        );
        setFetchAgain(true);
        setNewComment("");
      }
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

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return post;
        })
      );
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

  return (
    <div
      className={` mt-16 pt-1 lg:mt-0 ${
        isDarkMode ? "bg-black text-white" : ""
      } col-span-full   overflow-auto h-svh lg:col-start-2 lg:col-end-5`}
      id="scrollableDiv"
    >
      <CreatePost fetchPost={fetchAllPosts} fetchAgain={setFetchAgain} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostOnScroll}
        hasMore={hasMore}
        loader={<></>}
        endMessage={
          <div className="text-center py-4 text-xs text-gray-500 w-full  h-40">
            {/* <p> You have seen it all! </p>
            <p>Stay tuned for more updates.</p> */}
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex justify-center">
          <div className="w-full lg:w-3/5">
            {posts.length > 0 &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className={`w-full ${
                    isDarkMode ? "bg-black text-white" : ""
                  } flex flex-col justify-between items-center mb-10 relative`}
                >
                  <div className="flex items-center mb-3 p-2 w-full">
                    {post.postedUser?.profile?.image ? (
                      <img
                        onClick={() =>
                          currentUser._id === post.postedUser._id
                            ? navigate("/profile")
                            : navigate(`/profile/${post.postedUser.username}`)
                        }
                        className="w-10 h-10 mr-4 cursor-pointer rounded-full"
                        src={post.postedUser.profile.image}
                      />
                    ) : (
                      <Avatar
                        onClick={() =>
                          currentUser._id === post.postedUser._id
                            ? navigate("/profile")
                            : navigate(`/profile/${post.postedUser.username}`)
                        }
                        name={post.postedUser.username.slice(0)}
                        className="rounded-full me-4 cursor-pointer"
                        size="35"
                      />
                    )}
                    <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
                      <div
                        onClick={() =>
                          currentUser._id === post.postedUser._id
                            ? navigate("/profile")
                            : navigate(`/profile/${post.postedUser.username}`)
                        }
                        className="text-base cursor-pointer md:text-lg font-semibold flex gap-3"
                      >
                        <p>{post.postedUser.username}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 md:mt-0 flex gap-2">
                        {FormattedRelativeTime(post.createdAt)}
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
                          post.likes.userId &&
                          post.likes.userId.includes(currentUser._id)
                            ? `text-red-500`
                            : `${
                                isDarkMode ? "text-white" : "text-black"
                              } cursor-pointer`
                        }
                        onClick={() => {
                          post.likes.userId &&
                          post.likes.userId.length > 0 &&
                          post.likes.userId.includes(currentUser._id)
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
                        className="font-bold cursor-pointer"
                        onClick={() => handleCommentShow(post._id)}
                      />

                      {/* SHARE POST */}
                      <PiShareFatThin
                        onClick={() => handleCopyLink(post._id)}
                        size={25}
                        className="font-bold cursor-pointer"
                      />
                    </div>

                    {/* SAVE POST  */}
                    {/* <CiSaveDown2 size={27} className="font-bold" /> */}
                  </div>
                  <div className="flex w-full px-4 gap-5">
                    <p className="text-xs flex">
                      {post.likes.userId ? post.likes.userId.length : 0} likes
                    </p>
                    <p className="text-xs flex">
                      {post.comments[0].comment ? post.comments.length : 0}{" "}
                      comments
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
                                      name={comment.commenter.slice(0)}
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
                                          editCommentDisabled._id ===
                                            comment._id &&
                                          "border  border-gray-300 mx-1 p-1 rounded-full"
                                        } ${isDarkMode?"bg-black":"bg-gray-200"}`}
                                        onChange={(e) =>
                                          setEditedComment(e.target.value)
                                        }
                                        type="text"
                                        defaultValue={comment.comment}
                                        disabled={
                                          editCommentDisabled._id ===
                                          comment._id
                                            ? false
                                            : true
                                        }
                                      />
                                      {editCommentError.trim() &&
                                        editCommentDisabled._id ===
                                          comment._id && (
                                          <p className="text-red-600 text-xs">
                                            {editCommentError}
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  {comment.commentedUserId ==
                                    currentUser._id && (
                                    <div className="flex gap-1 mt-4">
                                      <HiOutlineDotsVertical
                                        onClick={() => {
                                          handleShowDropDown(
                                            comment._id,
                                            false
                                          );
                                          setEditCommentDisabled({
                                            _id: "",
                                            status: true,
                                          });
                                        }}
                                      />
                                    </div>
                                  )}
                                  {showEditCommentDropDown._id ===
                                    comment._id && (
                                    <ul className={`flex flex-col gap-2 ${isDarkMode?"bg-gray-900":' bg-gray-300'} rounded-xl p-2 relative right-0 top-8 z-10`}>
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
              ))}
          </div>
        </div>
      </InfiniteScroll>
      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}

export default Posts;
