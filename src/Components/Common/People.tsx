import { Follow, User } from "../../Interface/interface";

type PeopleProps = {
  users: User[];
  handleFollow: (id: string) => void;
  followers: Follow[];
};

function People({ users, handleFollow, followers }: PeopleProps) {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {

            // Check if the user has a follow status

            const followStatus = followers?followers.find(
              (follow) => follow.recipient === user._id
            ):null;

            return (
              <div
                key={user._id}
                className="w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mt-5"
                  alt={user.name}
                />
                <h6 className="mt-3">{user.name}</h6>
                {followStatus ? (
                  followStatus.status === "Pending" ? (
                    <button className="border border-custom-teal rounded-2xl px-5 py-1 mt-4 text-custom-teal">
                      Pending
                    </button>
                  ) : (
                    <button className="border border-custom-teal rounded-2xl px-5 py-1 mt-4 text-custom-teal">
                      Following
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleFollow(user._id)}
                    className="bg-custom-teal rounded-2xl px-5 py-1 mt-4 text-white"
                  >
                    Follow
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default People;
