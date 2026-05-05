import Avatar from "react-avatar";
import { User } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

type UserAvatarProp = {
  suggestions: string;
  isRight: boolean;
  friends?: any[] | [];
  onlineUsers?: string[];
  isLoading?: boolean;
  onFollowSuccess?: (userId: string) => void;
};

function UserAvatar({
  suggestions,
  isRight,
  friends,
  onlineUsers,
  isLoading = false,
  onFollowSuccess,
}: UserAvatarProp) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const handleFollow = async (id: string) => {
    const response = await userApi.followRequest(id);

    if (response?.status) {
      onFollowSuccess?.(id);
    }
  };
  return (
    <>
      <div className="mb-4">
        <h2
          className={`text-lg font-semibold tracking-tight ${
            isDarkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {suggestions}
        </h2>
        <p
          className={`mt-1 text-sm ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {isRight ? "See who is active right now" : "Fresh people worth connecting with"}
        </p>
      </div>
      {isLoading && !isRight && (
        <div className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-sm font-medium text-slate-700">Finding people for you</p>
          <p className="mt-1 text-sm text-slate-500">
            We are preparing fresh profile suggestions.
          </p>
        </div>
      )}
      {!isLoading && !friends?.length && !isRight && (
        <div className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-sm font-medium text-slate-700">No suggestions yet</p>
          <p className="mt-1 text-sm text-slate-500">
            We will show new people here as more accounts become available for you to follow.
          </p>
        </div>
      )}
      {!isLoading && !friends?.length && isRight && (
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium">No active friends right now</p>
          <p className="mt-1 text-sm app-muted">
            They’ll show up here when they come online.
          </p>
        </div>
      )}
      {friends &&
        friends.slice(0,5).map((user: User) => (
          <div
            key={user._id}
            className={`mt-3 flex items-center justify-between gap-3 rounded-2xl px-3 py-3 ${
              isRight ? "bg-white/5" : "bg-slate-50/90"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              {user.profile.image ? (
                <img
                  className="h-10 w-10 rounded-2xl object-cover"
                  src={user.profile.image}
                  alt="Rounded avatar"
                />
              ) : (
                <Avatar name={user.name} size="40" className="rounded-2xl" />
              )}
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">{user.username}</h2>
                <p className="truncate text-xs app-muted">{user.name}</p>
              </div>
            </div>
            {isRight ? (
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  onlineUsers?.includes(user._id)
                    ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                    : "bg-slate-300"
                }`}
              ></div>
            ) : (
              <button
                onClick={() => handleFollow(user._id)}
                className="rounded-xl bg-custom-blue px-3 py-2 text-[11px] font-semibold text-white"
              >
                Follow
              </button>
            )}
          </div>
        ))}
    </>
  );
}

export default UserAvatar;
