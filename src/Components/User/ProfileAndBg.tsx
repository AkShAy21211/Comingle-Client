import { useCallback, useState } from "react";
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
import { IoMdHeartEmpty, IoMdSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import FormattedRelativeTime from "../../Utils/Time";
type ProfileProp = {
  isMyProfile: boolean;
  fetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
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
  //////// fetching user profile ///////////////

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const deletePost = async (postId: string) => {
    try {
      console.log("fdsfdsfsf");

      await userApi.deletePost(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleFollow = async (id: string) => {
    await userApi.followRequest(id);
  };

  const handleMessage = async (participantId: string) => {
    try {
      await userApi.accessChat(participantId);
      await userApi.fetchAllChats();
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
        className={`object-cover  w-52 h-36 md:h-52 cursor-pointer`}
      />
    ) : (
      <video
        key={index}
        onClick={() => setSelectedPost(posts)}
        className={`object-cover w-52 h-36 md:h-52 cursor-pointer`}
        autoPlay
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
        console.log('commmmmmmmmmmmmmmmmmmet',commentResponse);
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost;

          return {
            ...prevPost,
            comments: [...prevPost.comments, commentResponse],
          };
        });

        setNewComment("");
        setReload(true);
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
      <div className="w-full border">
        {isMyProfile && (
          <FaRegEdit
            onClick={() => setShowCoverMdal(true)}
            size={18}
            className={` float-end text-custom-blue right-4  text-lg relative top-20 lg:top-20`}
          />
        )}
        <img
          src={user?.profile.background}
          className="object-cover h-52 lg:h-72 w-full "
          alt=""
        />
      </div>
      {isMyProfile && (
        <FaRegEdit
          size={18}
          onClick={() => setShowDpMdal(true)}
          className="float-end relative  top-24   right-0 lg:top-36 lg:mt-3  lg:right-0"
        />
      )}
      <div
        className={`relative object-cover  ${
          user?.profile.image ? " " : " border-none shadow-none"
        }  flex justify-center -top-16 lg:-top-24 rounded-full lg:w-52 h-32 w-32 lg:h-52`}
      >
        {user?.profile.image ? (
          <img
            className={`${
              isDarkMode ? "bg-black backdrop:blur-lg" : "bg-white"
            } object-cover lg:w-36 lg:h-36 rounded-full`}
            src={user?.profile?.image}
          />
        ) : (
          <Avatar className=" rounded-full" size="140" name={user?.name} />
        )}
        {user?.profile.isPremium && (
          <MdVerified
            className="absolute top-20 left-20 lg:top-32 lg:-mt-6 lg:left-32  text-blue-500"
            size={45}
          />
        )}
      </div>
      <div className="relative w-auto   justify-start flex-col  lg:flex-row lg:justify-center mb-8 mt-10 lg:mt-1 ">
        <h2 className=" -mt-14 font-bold  text-center  ">{user?.username}</h2>
        <p className="  font-light ">{user?.profile.bio}</p>
        {!isMyProfile && (
          <div className="w-96 flex gap-1 justify-center mb-5 mt-3">
            <button
              className="bg-custom-blue px-5 py-3 rounded-lg text-white "
              onClick={() => {
                handleFollow(user?._id as string);
              }}
            >
              Follow
            </button>
            <Link
              to="/chats"
              onClick={() => handleMessage(user?._id as string)}
              className="bg-custom-blue px-5 py-3 rounded-lg text-white "
            >
              Message
            </Link>
          </div>
        )}
      </div>
      <div className=" -mt-5 lg:-mt-14 flex w-full justify-center p-5 gap-5 h-32">
        <div className="border  border-black h-16 p-2 w-full lg:w-1/6 rounded-lg flex items-center flex-col">
          {user?.profile.followers?.length}
          <p>Followers</p>
        </div>
        <div className=" border    p-2 border-black h-16  w-full lg:w-1/6 rounded-lg flex items-center flex-col">
          {user?.profile.following?.length}
          <p>Following</p>
        </div>
        <div className=" border p-2 border-black h-16 w-full lg:w-1/6 rounded-lg flex items-center flex-col">
          {posts?.length}
          <p>Posts</p>
        </div>
      </div>
      <div className="tab-buttons flex justify-around w-full">
        <button
          onClick={() => handleTabClick("images")}
          className="bg-custom-blue px-3 py-1 rounded-full text-white"
        >
          <FaImages />
        </button>
        <button
          onClick={() => handleTabClick("text")}
          className="bg-custom-blue px-3 rounded-full text-white"
        >
          <CiText />
        </button>
      </div>{" "}
      <div className=" h-auto w-full flex p-3 justify-center">
        {activeTab === "text" ? (
          <div className="text-content break-words w-full ">
            {posts &&
              posts.map(
                (post) =>
                  !post.image.length &&
                  post.description && (
                    <ul>
                      <li>
                        <small className="float-end flex gap-1 font-bold">
                          {FormattedRelativeTime(post.createdAt)}
                        </small>

                        <div
                          onClick={() => setSelectedTextPost(post)}
                          className="mt-5 cursor-pointer   p-5 font-sans rounded-lg"
                        >
                          <p
                            className="text-wrap break-words w-full"
                            key={post._id}
                          >
                            {post.description}
                          </p>
                        </div>
                        <div className="flex gap-5 px-3 mt-3">
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
                            <p>{post?.likes?.userId?.length || 0}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <FaRegComment />
                            <p>{post.comments.length || 0}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  )
              )}
            {!posts?.length && (
              <div className=" flex justify-center w-full mt-10 h-auto overflow-auto overscroll-y-auto col-span-full">
                <p className="text-center w-full">
                  {isMyProfile
                    ? "You didn't post anything yet. Share your thoughts with others"
                    : "No posts yet"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="image-content grid grid-cols-3  sm:grid-cols-3  md:grid-cols-4  gap-3">
            {posts &&
              posts.map((post: PostsType) =>
                post && post.image.length && post.image.length > 1 ? (
                  <Slider {...settings}>
                    {post.image.map(
                      (item: { url: string; type: string }, index) =>
                        renderContentItem(item, index, post)
                    )}
                  </Slider>
                ) : (
                  <>{renderContentItem(post.image[0], 0, post)}</>
                )
              )}
            {!posts?.length && (
              <div className=" flex justify-center w-full mt-10 h-auto overflow-auto overscroll-y-auto col-span-full">
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
        setFetchAgain={fetchAgain}
        showCoverModal={showCoverModal}
        setShowCoverMdal={setShowCoverMdal}
        showDpModal={showDpModal}
        setShowDpMdal={setShowDpMdal}
      />
      {selectedPost && (
        <ViewPostModal
          reload={reload}
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
    </>
  );
}

export default ProfileAndBg;
