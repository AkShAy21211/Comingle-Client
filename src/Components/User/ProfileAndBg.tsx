import { useCallback, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileModal from "../Common/ProfileModal";
import userApi from "../../Apis/user";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Likes, PostsType, User } from "../../Interface/interface";
import Avatar from "react-avatar";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { CiText } from "react-icons/ci";
import { FaImages } from "react-icons/fa";
import ViewPostModal from "../Common/ViewPostModal";
import Slider from "react-slick";
import ViewTextPostModal from "../Common/ViewTextPostModal";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import FormattedRelativeTime from "../../Utils/Time";
import FriendsModal from "./FriendsModal";
type ProfileProp = {
  isMyProfile: boolean;
  setfetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  fetchAgain: boolean;
  setPosts: React.Dispatch<React.SetStateAction<PostsType[]>>;
  posts: PostsType[];
};
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

function ProfileAndBg({
  isMyProfile,
  user,
  posts,
  setfetchAgain,
  fetchAgain,
  setPosts,
}: ProfileProp) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [showCoverModal, setShowCoverMdal] = useState(false);
  const [showDpModal, setShowDpMdal] = useState(false);
  const [activeTab, setActiveTab] = useState("image");
  const [selectedPost, setSelectedPost] = useState<PostsType | null>(null);
  const [selectedTextPost, setSelectedTextPost] = useState<PostsType | null>(
    null
  );
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [editCommentError, setEditCommentError] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const [commetError, setCommentError] = useState<{
    postId: string;
    error: string;
  }>({ postId: "", error: "" });
  const [newComment, setNewComment] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [friends, setFriends] = useState<User[] | []>([]);
  const [showFriends, setShowFriends] = useState(false);
  const [followers, setFollowers] = useState<User[] | []>([]);
  const [followeing, setFollowing] = useState<User[] | []>([]);
  const [type, setType] = useState("");
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [followActionLoading, setFollowActionLoading] = useState("");
  const [messageLoading, setMessageLoading] = useState("");
  //////// fetching user profile ///////////////

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const deletePost = async (postId: string) => {
    try {
      await userApi.deletePost(postId);
      setfetchAgain(true);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  async function fetchCurrentUserProfile() {
    try {
      const response = await userApi.profile();
      if (response) {
        setCurrentUserData(response.user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCurrentUserProfile();
  }, []);

  useEffect(() => {
    const getFriends = async (userId: string) => {
      if (user) {
        try {
          const response: User = await userApi.getFriends(userId);
          const followers: User[] | [] = response.profile.followers || [];
          const following: User[] | [] = response.profile.following || [];
          setFollowers(followers);
          setFollowing(following);
          return;
        } catch (error) {
          console.log(error);
        }
      }
    };

    getFriends(user?._id as string);
  }, [user]);

  const handleShowFriends = (type: string) => {
    setShowFriends(true);
    if (type === "following") {
      setFriends(followeing);
      setType("following");
      return;
    } else if (type === "follower") {
      setFriends(followers);
      setType("follower");
      return;
    }
  };

  const handleFollow = async (id: string) => {
    try {
      setFollowActionLoading(id);
      await userApi.followRequest(id);
      fetchCurrentUserProfile();
    } finally {
      setFollowActionLoading("");
    }
  };

  const handleMessage = async (participantId: string) => {
    try {
      setMessageLoading(participantId);
      await userApi.accessChat(participantId);
      await userApi.fetchAllChats();
    } catch (error) {
      console.log(error);
    } finally {
      setMessageLoading("");
    }
  };

  const editPost = async (postId: string, editPostCption: string) => {
    try {
      if (!editPostCption.trim()) {
        return;
      }
      await userApi.editPost(postId, editPostCption);
      setSelectedPost(null);
      setSelectedTextPost(null);
      setfetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContentItem = (
    item: { url: string; type: string },
    index: number,
    posts: PostsType
  ) => {
    if (!item) return;
    return item.type === "image" ? (
      <img
        key={index}
        src={item.url}
        onClick={() => setSelectedPost(posts)}
        alt={`Image ${index}`}
        className="aspect-square h-full w-full cursor-pointer rounded-[20px] object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
    ) : (
      <video
        key={index}
        onClick={() => setSelectedPost(posts)}
        className="aspect-square h-full w-full cursor-pointer rounded-[20px] object-cover transition-transform duration-300 hover:scale-[1.02]"
        autoPlay
        muted
        src={item.url}
      ></video>
    );
  };

  const handleEditComment = async (
    commentId: string,
    postId: string,
    editedComment: string
  ) => {
    if (!editedComment.trim()) {
      setEditCommentError("Enter a comment");
      return;
    }
    setEditCommentError("");
    try {
      const comment = await userApi.editComment(
        postId,
        commentId,
        editedComment
      );

      if (comment) {
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost;

          prevPost.comments.map((comment) => {
            if (comment._id === commentId) {
              comment.comment = editedComment;
            }

            return;
          });
          return prevPost;
        });
      }
      setReload(true);
      setNewComment("");
      setCommentError({ postId: "", error: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await userApi.deleteComment(postId, commentId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (
    postId: string,
    userId: string,
    authorId: string
  ) => {
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
        authorId
      );
      if (commentResponse) {
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost;

          return {
            ...prevPost,
            comments: [...prevPost.comments, commentResponse],
          };
        });
        setSelectedTextPost(null);
        setfetchAgain(!fetchAgain);
        setNewComment("");
        setReload(true);
        setSelectedPost(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //////////////////////// HANDLE USER LIKE POST //////////////////////////

  const likePost = useCallback(
    async (postId: string, userId: string, authorId: string) => {
      try {
        const likeResponse = await userApi.likePost(postId, userId, authorId);
        console.log("like", likeResponse);

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
  return (
    <>
      <div
        className={`app-panel relative w-full overflow-hidden rounded-[28px] border sm:rounded-[36px] ${
          isDarkMode
            ? "border-white/10 bg-slate-900/70"
            : "border-white/70 bg-white/90"
        }`}
      >
        {isMyProfile && (
          <FaRegEdit
            onClick={() => setShowCoverMdal(true)}
            size={18}
            className={`absolute right-4 top-4 z-20 cursor-pointer rounded-full bg-white/85 p-2 text-custom-blue shadow-md backdrop-blur sm:right-5 sm:top-5`}
          />
        )}
        <img
          src={user?.profile.background}
          className="h-44 w-full object-cover sm:h-56 lg:h-80"
          alt=""
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent sm:h-32" />
      </div>
      <div className="relative z-10 mx-auto -mt-14 w-full max-w-5xl px-3 sm:-mt-20 sm:px-5 lg:-mt-24">
        <div
          className={`app-panel rounded-[28px] border p-4 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.42)] sm:rounded-[34px] sm:p-6 ${
            isDarkMode
              ? "border-white/10 bg-slate-950/85"
              : "border-white/80 bg-white/95"
          }`}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5">
              <div
                className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[28px] sm:h-32 sm:w-32 lg:h-40 lg:w-40`}
              >
                {user?.profile.image ? (
                  <img
                    className={`h-28 w-28 rounded-[28px] border-4 object-cover shadow-2xl sm:h-32 sm:w-32 lg:h-40 lg:w-40 ${
                      isDarkMode
                        ? "border-slate-900 bg-black"
                        : "border-white bg-white"
                    }`}
                    src={user?.profile?.image}
                  />
                ) : (
                  <Avatar
                    className="rounded-[28px]"
                    size="140"
                    name={user?.name}
                  />
                )}
                {isMyProfile && (
                  <FaRegEdit
                    size={18}
                    onClick={() => setShowDpMdal(true)}
                    className="absolute -bottom-1 -right-1 z-40 cursor-pointer rounded-full bg-white p-2 text-custom-blue shadow-lg"
                  />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {user?.username}
                  </p>
                  {user?.profile.isPremium && (
                    <MdVerified className="text-xl text-blue-600 sm:text-2xl" />
                  )}
                </div>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 app-muted sm:mx-0 sm:text-base">
                  {user?.profile.bio || "Add a short bio so people know who you are."}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="app-chip">
                    {posts?.length || 0} posts shared
                  </span>
                  <span className="app-chip">
                    {user?.profile.followers?.length || 0} followers
                  </span>
                  <span className="app-chip">
                    {user?.profile.following?.length || 0} following
                  </span>
                </div>
              </div>
            </div>
            {isMyProfile && (
              <div className="flex items-center justify-center lg:justify-end">
                <button
                  onClick={() => setShowCoverMdal(true)}
                  className="app-button-secondary px-4 py-2.5 text-sm font-semibold"
                >
                  Edit cover
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative mb-8 mt-6 flex w-auto flex-col justify-start lg:justify-center">
        {!isMyProfile && (
          <div className="mb-5 mt-3 flex w-auto flex-wrap justify-center gap-3 px-4">
            {currentUserData?.profile?.following?.includes(user?._id as any) ? (
              <button
                className="app-button-secondary px-4 py-2"
                // onClick={() => {
                //   handleFollow(user?._id as string);
                // }}
              >
                Following
              </button>
            ) : currentUserData?.profile?.followers?.includes(
                user?._id as any
              ) ? (
              <button
                className="app-button-primary px-4 py-2"
                disabled={followActionLoading === user?._id}
                onClick={() => {
                  handleFollow(user?._id as string);
                }}
              >
                {followActionLoading === user?._id ? "Please wait..." : "Follow Back"}
              </button>
            ) : (
              <button
                className="app-button-primary px-4 py-2"
                disabled={followActionLoading === user?._id}
                onClick={() => {
                  handleFollow(user?._id as string);
                }}
              >
                {followActionLoading === user?._id ? "Please wait..." : "Follow"}
              </button>
            )}

            <Link
              to="/chats"
              onClick={() => handleMessage(user?._id as string)}
              className="app-button-secondary px-4 py-2"
            >
              {messageLoading === user?._id ? "Opening..." : "Message"}
            </Link>
          </div>
        )}
      </div>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-3 gap-3 px-2 py-2 sm:gap-4 sm:px-4">
        <div
          onClick={() => handleShowFriends("follower")}
          className={`app-panel flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[24px] border p-3 text-center transition-transform duration-200 hover:-translate-y-0.5`}
        >
          <p className="text-2xl font-bold">{user?.profile.followers?.length}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] app-muted sm:text-sm">
            Followers
          </p>
        </div>
        <div
          onClick={() => handleShowFriends("following")}
          className={`app-panel flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[24px] border p-3 text-center transition-transform duration-200 hover:-translate-y-0.5`}
        >
          <p className="text-2xl font-bold">{user?.profile.following?.length}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] app-muted sm:text-sm">
            Following
          </p>
        </div>
        <div
          className={`app-panel flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[24px] border p-3 text-center transition-transform duration-200 hover:-translate-y-0.5`}
        >
          <p className="text-2xl font-bold">{posts?.length}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] app-muted sm:text-sm">
            Posts
          </p>
        </div>
      </div>
      <div
        className={`mx-auto mt-5 flex w-full max-w-md items-center justify-center rounded-full border p-2 ${
          isDarkMode ? "border-white/10 bg-white/5" : "border-white/80 bg-white/75"
        }`}
      >
        <button
          onClick={() => handleTabClick("images")}
          className={`${activeTab !== "text" ? "app-button-primary" : "app-button-secondary"} flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold`}
        >
          <FaImages />
          Photos
        </button>
        <button
          onClick={() => handleTabClick("text")}
          className={`${activeTab === "text" ? "app-button-primary" : "app-button-secondary"} flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold`}
        >
          <CiText />
          Thoughts
        </button>
      </div>
      <div className="mt-5 h-full w-full p-1 sm:p-3">
        {activeTab === "text" ? (
          <div className="mx-auto grid w-full max-w-4xl gap-4 text-content break-words">
            {posts &&
              posts.map(
                (post) =>
                  !post.image.length &&
                  post.description && (
                    <ul key={post._id}>
                      <li className="app-panel rounded-[24px] border p-5 sm:rounded-[28px] sm:p-6">
                        <small className="float-end flex gap-1 text-xs font-semibold app-muted">
                          {FormattedRelativeTime(post.createdAt)}
                        </small>

                        <div
                          onClick={() => setSelectedTextPost(post)}
                          className="mt-5 cursor-pointer rounded-lg p-1 font-sans"
                        >
                          <p
                            className="w-full break-words text-wrap text-base leading-7 sm:text-lg"
                            key={post._id}
                          >
                            {post.description}
                          </p>
                        </div>
                        <div className="mt-4 flex gap-6 px-1">
                          <div className="flex flex-col items-center justify-center">
                            <IoMdHeartEmpty
                              onClick={() =>
                                post.likes.userId.includes(currentUser._id)
                                  ? unLikePost(post._id, currentUser._id)
                                  : likePost(
                                      post._id,
                                      currentUser._id,
                                      post.postedUser._id
                                    )
                              }
                              size={20}
                              className={`${
                                post?.likes?.userId?.includes(currentUser._id)
                                  ? "text-red-600"
                                  : ""
                              }`}
                            />
                            <p className="mt-1 text-sm app-muted">{post?.likes?.userId?.length || 0}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <FaRegComment />
                            <p className="mt-1 text-sm app-muted">
                              {post.comments[0].comment
                                ? post.comments.length
                                : 0}
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  )
              )}
            {!posts?.length && (
              <div className="app-panel col-span-full mt-6 flex h-full w-full justify-center overflow-auto overscroll-y-auto rounded-[28px] border p-8 sm:mt-10">
                <p className="w-full text-center">
                  {isMyProfile
                    ? "You didn't post anything yet. Share your thoughts with others"
                    : "No posts yet"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="image-content mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {posts &&
              posts.map((post: PostsType) =>
                post && post.image.length && post.image.length > 1 ? (
                  <div
                    key={post._id}
                    className="app-panel group overflow-hidden rounded-[24px] border p-2 sm:rounded-[28px]"
                  >
                    <Slider {...settings}>
                      {post.image.map(
                        (item: { url: string; type: string }, index) =>
                          renderContentItem(item, index, post)
                      )}
                    </Slider>
                  </div>
                ) : (
                  <div
                    key={post._id}
                    className="app-panel group overflow-hidden rounded-[24px] border p-2 sm:rounded-[28px]"
                  >
                    {renderContentItem(post.image[0], 0, post)}
                  </div>
                )
              )}
            {!posts?.length && (
              <div className="app-panel col-span-full mt-6 flex h-full w-full justify-center overflow-auto overscroll-y-auto rounded-[28px] border p-8 sm:mt-10">
                <p className="text-center">
                  {isMyProfile
                    ? "You didn't post anything yet. Share your thoughts with others"
                    : "No posts yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <ProfileModal
        setFetchAgain={setfetchAgain}
        showCoverModal={showCoverModal}
        setShowCoverMdal={setShowCoverMdal}
        showDpModal={showDpModal}
        setShowDpMdal={setShowDpMdal}
      />
      {selectedPost && (
        <ViewPostModal
          reload={reload}
          handlePostEdit={editPost}
          likePost={likePost}
          unlikePost={unLikePost}
          setReload={setReload}
          setNewComent={setNewComment}
          editedComment={editedComment}
          editedCommentError={editCommentError}
          editComment={handleEditComment}
          newComment={newComment}
          newCommentError={commetError}
          deleteComment={handleDeleteComment}
          setEditedComment={setEditedComment}
          deletePost={deletePost}
          handleNewComent={handleCommentSubmit}
          currentUserId={currentUser._id}
          setSelectedPost={setSelectedPost}
          selectedPost={selectedPost}
        />
      )}
      {selectedTextPost && (
        <ViewTextPostModal
          reload={reload}
          handlePostEdit={editPost}
          setReload={setReload}
          likePost={likePost}
          unlikePost={unLikePost}
          handleNewComent={handleCommentSubmit}
          setEditedComment={setEditedComment}
          deleteComment={handleDeleteComment}
          setNewComent={setNewComment}
          deletePost={deletePost}
          newComment={newComment}
          newCommentError={commetError}
          editComment={handleEditComment}
          editedComment={editedComment}
          editedCommentError={editCommentError}
          selectedPost={selectedTextPost}
          setSelectedPost={setSelectedTextPost}
          currentUserId={currentUser._id}
        />
      )}
      {showFriends && (
        <FriendsModal
          isMyProfile={isMyProfile}
          fetchAgain={setfetchAgain}
          type={type}
          currentUser={currentUser}
          followUser={handleFollow}
          user={user}
          setShowFriends={setShowFriends}
          friends={friends}
        />
      )}
    </>
  );
}

export default ProfileAndBg;
