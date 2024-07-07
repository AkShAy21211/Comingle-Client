import Avatar from "react-avatar";
import { User } from "../../Interface/interface";
import userApi from "../../Apis/user";

type UserAvatarProp = {
  suggestions: string;
  isRight: boolean;
  friends?: any[] | [];
  onlineUsers?: string[];
};

function UserAvatar({
  suggestions,
  isRight,
  friends,
  onlineUsers,
}: UserAvatarProp) {
  const handleFollow = async (id: string) => {
    await userApi.followRequest(id);
  };
  return (
    <>
      <h2 className="px-10 font-bold ">{suggestions}</h2>
      {friends &&
        friends.slice(0,5).map((user: User) => (
          <div
            key={user._id}
            className={`${
              isRight
                ? "flex justify-between space-x-4 mt-7 px-10"
                : "flex  space-x-4 mt-7 px-10 justify-between w-64"
            } `}
          >
            {user.profile.image ? (
              <img
                className="w-6 h-6 rounded-full"
                src={user.profile.image}
                alt="Rounded avatar"
              />
            ) : (
              <Avatar name={user.name} size="25" className="rounded-full" />
            )}
            <h2>{user.username}</h2>
            {isRight && (
              <div
                className={`w-2 h-2 ${
                  onlineUsers?.includes(user._id)
                    ? "bg-green-600"
                    : "bg-gray-500"
                } rounded-lg m-2`}
              ></div>
            )}
            {!isRight && (
              <button
                onClick={() => handleFollow(user._id)}
                className="bg-custom-blue px-2 text-xs text-white rounded-lg"
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
