import { useSelector } from "react-redux";
import { Follow, User } from "../../Interface/interface";

import FollowButton from "../User/FollowButton";
import { RootState } from "../../Redux/store";

type PeopleProps = {
  users: User[];
};


function People({ users }: PeopleProps) {

    const currentUser = useSelector((state:RootState)=>state.user.user._id);

    
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {

        

            
            

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
               
                
               <FollowButton recipientId={user._id} requesterId={currentUser}/>

              </div>
              
            );
          })}
        </div>
      </div>
    </>
  );
}

export default People;
