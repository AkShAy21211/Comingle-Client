import { useSelector } from "react-redux";
import { Follow, User } from "../../Interface/interface";
import { RootState } from "../../Redux/store";

type PeopleProps = {
  users: User[];
  handleFollow: (id: string) => void;
  followers: Follow[];
};

function People({ users, handleFollow, followers }: PeopleProps) {

  const currentUser = useSelector((state:RootState)=> state.user.user._id);
  
  console.log(followers);
  
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {

            // Check if the user has a follow status

            const followStatus = followers.find(
              (follow) => follow.recipient === user._id
            );


            
            
            return (
              <div
                key={user._id}
                className="w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center"
              >
                <img
                  src={user.profile.image}
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mt-5"
                  alt={user.name}
                />
                <h6 className="mt-3">{user.name}</h6>
                {followStatus && (

                  followStatus.status === 'Pending' && followStatus.requester._id === currentUser ? (
                    <button
                    onClick={() => handleFollow(user._id)}
                    className="border border-custom-teal rounded-2xl px-5 py-1 mt-4 text-custom-teal"
                  >
                    Following
                  </button>
                  ):(
                    <button
                    onClick={() => handleFollow(user._id)}
                    className="bg-custom-teal rounded-2xl px-5 py-1 mt-4 text-white"
                  >
                    Follow Back
                  </button>
                  )
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
