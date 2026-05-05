import Avatar from "react-avatar";
import { User } from "../../Interface/interface";
import React from "react";
import userApi from "../../Apis/user";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

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
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

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

  const modalTitle = type === "following" ? "Following" : "Followers";
  const modalSubtitle =
    type === "following"
      ? "People connected to this profile."
      : "People who follow this profile.";

  if (!friends.length) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 p-3 backdrop-blur-md sm:p-5">
      <div className="mx-auto flex h-full max-w-2xl items-center justify-center">
        <div
          className={`flex h-full max-h-[88vh] w-full flex-col overflow-hidden rounded-[28px] border sm:rounded-[32px] ${
            isDarkMode
              ? "border-white/10 bg-slate-950 text-white"
              : "border-white/80 bg-white text-slate-900"
          } shadow-[0_35px_110px_-42px_rgba(15,23,42,0.55)]`}
        >
          <div
            className={`flex items-start justify-between border-b px-5 py-5 sm:px-6 ${
              isDarkMode ? "border-white/10" : "border-slate-100"
            }`}
          >
            <div>
              <span className="app-chip">{modalTitle}</span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {modalTitle}
              </h2>
              <p className="mt-2 text-sm app-muted">{modalSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowFriends(false)}
              className={`rounded-full p-2 ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
              }`}
            >
              <IoMdClose size={22} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-3">
              {friends.map((friend: User) => {
                const isMutual =
                  !isMyProfile &&
                  (friend?.profile?.following?.includes(currentUser?._id as any) ||
                    friend.profile.followers?.includes(currentUser?._id as any));

                return (
                  <div
                    key={friend._id}
                    className={`flex flex-col gap-3 rounded-[24px] border p-4 sm:flex-row sm:items-center sm:justify-between ${
                      isDarkMode
                        ? "border-white/10 bg-white/5"
                        : "border-slate-100 bg-slate-50/90"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {friend?.profile?.image ? (
                        <img
                          className="h-12 w-12 rounded-2xl object-cover sm:h-14 sm:w-14"
                          src={friend.profile.image}
                          alt=""
                        />
                      ) : (
                        <Avatar
                          size="56"
                          className="rounded-2xl"
                          name={friend.name}
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold sm:text-base">
                          {friend.username}
                        </p>
                        <p className="truncate text-xs sm:text-sm app-muted">
                          {friend.name}
                        </p>
                        {!isMyProfile &&
                          (type === "following" || type === "follower") &&
                          isMutual && (
                            <p className="mt-1 text-xs font-medium text-emerald-500">
                              Mutual friend
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      {isMyProfile && type === "following" && (
                        <button
                          onClick={() => unfollowUser(friend._id)}
                          className="app-button-secondary px-4 py-2 text-sm"
                        >
                          Unfollow
                        </button>
                      )}

                      {isMyProfile &&
                        type === "follower" &&
                        user?.profile?.following?.includes(friend._id as any) && (
                          <button className="app-button-secondary px-4 py-2 text-sm">
                            Following
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "following" &&
                        currentUser?._id === friend._id &&
                        user?.profile?.followers?.includes(currentUser?._id as any) && (
                          <button className="app-button-secondary px-4 py-2 text-sm">
                            Following
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "following" &&
                        currentUser?._id === friend._id &&
                        !user?.profile?.followers?.includes(currentUser?._id as any) && (
                          <button
                            onClick={() => followUser(user?._id as string)}
                            className="app-button-primary px-4 py-2 text-sm"
                          >
                            Follow Back
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "following" &&
                        currentUser?._id !== friend._id &&
                        !currentUser?.profile?.following?.includes(user?._id as any) &&
                        !friend.profile?.following?.includes(currentUser?._id as any) && (
                          <button
                            onClick={() => followUser(user?._id as string)}
                            className="app-button-secondary px-4 py-2 text-sm"
                          >
                            Follow
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "following" &&
                        currentUser?._id !== friend._id &&
                        !currentUser?.profile?.following?.includes(user?._id as any) &&
                        friend?.profile?.following?.includes(currentUser?._id as any) && (
                          <button
                            onClick={() => followUser(user?._id as string)}
                            className="app-button-primary px-4 py-2 text-sm"
                          >
                            Follow Back
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "following" &&
                        currentUser?._id !== friend._id &&
                        currentUser?.profile?.following?.includes(user?._id as any) &&
                        !friend?.profile?.following?.includes(currentUser?._id as any) && (
                          <button
                            onClick={() => unfollowUser(friend._id)}
                            className="app-button-secondary px-4 py-2 text-sm"
                          >
                            Unfollow
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "follower" &&
                        currentUser?._id === friend._id && (
                          <button className="app-button-secondary px-4 py-2 text-sm">
                            Following
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "follower" &&
                        currentUser?._id !== friend._id &&
                        currentUser?.profile?.followers?.includes(friend._id as any) && (
                          <button
                            onClick={() => unfollowUser(friend._id)}
                            className="app-button-secondary px-4 py-2 text-sm"
                          >
                            Unfollow
                          </button>
                        )}

                      {!isMyProfile &&
                        type === "follower" &&
                        currentUser?._id !== friend._id &&
                        !currentUser?.profile?.followers?.includes(friend._id as any) && (
                          <button
                            onClick={() => followUser(user?._id as string)}
                            className="app-button-secondary px-4 py-2 text-sm"
                          >
                            Follow
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsModal;
