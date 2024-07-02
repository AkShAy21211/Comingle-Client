import Avatar from "react-avatar";
import { User } from "../../Interface/interface";
import React from "react";
import userApi from "../../Apis/user";

type FriendsModalProp = {
  friends: User[] | [];
  user: User | null;
  type: string;
  fetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  isMyProfile: boolean;
  currentUser: User | null;
  followUser: (userId: string) => Promise<void>;
  setShowFriends: React.Dispatch<React.SetStateAction<boolean>>;
};

function FriendsModal({
  friends,
  setShowFriends,
  user,
  followUser,
  fetchAgain,
  type,
  isMyProfile,
  currentUser,
}: FriendsModalProp) {
  const unfollowUser = async (followingId: string) => {
    try {
      const response = await userApi.unfollow(followingId);

      if (response) {
        fetchAgain(true);
        setShowFriends(false);
      }
    } catch (error) {
      fetchAgain(false);
      console.log(error);
    }
  };

  return (
    <>
      {friends.length && (
        <div id="modal" aria-hidden="true" className="fixed inset-0 z-50">
          <div className="grid grid-cols-12 m-5 md:m-0">
            {/* Modal content */}
            <div className="relative col-span-full md:col-start-2 md:col-span-10 lg:col-start-5 lg:col-span-4 rounded-lg backdrop-blur-lg shadow-xl border mt-20 ">
              {/* Modal header */}
              <div className="flex justify-between p-4">
                <button
                  type="button"
                  onClick={() => setShowFriends(false)}
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

              <div className="p-4 md:p-5 gap-3 flex flex-col w-full">
                {friends?.map((friend: User) => (
                  <div className="flex gap-3 justify-around w-full">
                    {friend.profile.image ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={friend.profile.image}
                        alt=""
                      />
                    ) : (
                      <Avatar
                        size="40"
                        className="rounded-full"
                        name={friend.name}
                      />
                    )}
                    <p className="p-2">{friend.username}</p>

                    {/* CASE WHEN VIEWING FOLLOWER AND FOLLOWING OF OWN PROFILE */}

                    {isMyProfile && type === "following" && (
                      <button
                        onClick={() => unfollowUser(friend._id)}
                        className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                      >
                        Unfollow
                      </button>
                    )}

                    {isMyProfile &&
                      type === "follower" &&
                      user?.profile.following?.includes(friend._id as any) ? (
                        <button className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light">
                          Following
                        </button>
                      ):
                      (
                        <button 
                         onClick={() => followUser(friend?._id as string)}
                        className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light">
                          Follow back
                        </button>
                      )}

                    {/* CASE WHEN VIEWING FOLLOWER AND FOLLOWING OF OTHER PROFILE */}

                    {!isMyProfile &&
                      type === "following" &&
                      currentUser?._id === friend._id &&
                      currentUser.profile.following?.includes(
                        user?._id as any
                      ) && (
                        <button className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light">
                          Following
                        </button>
                      )}
                    {!isMyProfile &&
                      type === "following" &&
                      currentUser?._id === friend._id &&
                      !currentUser.profile.following?.includes(
                        user?._id as any
                      ) && (
                        <button
                          onClick={() => followUser(user?._id as string)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Follow Back
                        </button>
                      )}

                    {!isMyProfile &&
                      type === "following" &&
                      currentUser?._id !== friend._id &&
                      !currentUser?.profile.following?.includes(
                        user?._id as any
                      ) &&
                      !friend.profile.following?.includes(
                        currentUser?._id as any
                      ) && (
                        <button
                          onClick={() => followUser(user?._id as string)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Follow
                        </button>
                      )}
                    {!isMyProfile &&
                      type === "following" &&
                      currentUser?._id !== friend._id &&
                      !currentUser?.profile.following?.includes(
                        user?._id as any
                      ) &&
                      friend.profile.following?.includes(
                        currentUser?._id as any
                      ) && (
                        <button
                          onClick={() => followUser(user?._id as string)}
                          className="bg-custom-blue roun   ded-lg px-2 text-white text-sm font-light"
                        >
                          Follow Back
                        </button>
                      )}
                    {!isMyProfile &&
                      type === "following" &&
                      currentUser?._id !== friend._id &&
                      currentUser?.profile.following?.includes(
                        user?._id as any
                      ) &&
                      !friend.profile.following?.includes(
                        currentUser?._id as any
                      ) && (
                        <button
                          onClick={() => unfollowUser(friend._id)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Unfollow
                        </button>
                      )}

                    {!isMyProfile &&
                      type === "follower" &&
                      currentUser?._id === friend._id && (
                        <button
                          onClick={() => unfollowUser(friend._id)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Unfollow
                        </button>
                      )}

                    {!isMyProfile &&
                      type === "follower" &&
                      currentUser?._id !== friend._id &&
                      currentUser?.profile.followers?.includes(
                        friend._id as any
                      ) && (
                        <button
                          onClick={() => unfollowUser(friend._id)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Unfollow
                        </button>
                      )}
                    {!isMyProfile &&
                      type === "follower" &&
                      currentUser?._id !== friend._id &&
                      !currentUser?.profile.followers?.includes(
                        friend._id as any
                      ) && (
                        <button
                          onClick={() => followUser(user?._id as string)}
                          className="bg-custom-blue rounded-lg px-2 text-white text-sm font-light"
                        >
                          Follow
                        </button>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FriendsModal;
