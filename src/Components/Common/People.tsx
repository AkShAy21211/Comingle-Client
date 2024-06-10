import { useSelector } from "react-redux";
import { Follow, User } from "../../Interface/interface";
import Avatar from "react-avatar";
import FollowButton from "../User/FollowButton";
import { RootState } from "../../Redux/store";
import { useNavigate } from "react-router-dom";

type PeopleProps = {
  users: User[];
};


function People({ users }: PeopleProps) {

    const currentUser = useSelector((state:RootState)=>state.user.user._id);
    const navigate = useNavigate();
    
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {

        

            
            

            return (
              <div
                key={user._id}
                className="w-full h-36 md:h-52 rounded-lg flex flex-col items-center cursor-pointer"
                onClick={()=>navigate(`/profile/${user._id}`)}
              >

                {
                  user?.profile?.image?  <img
                  src={user.profile.image}
                  className="w-20 h-20 rounded-full object-cover mt-5"
                  alt={user.name}
                />:<Avatar name={user.name} className="rounded-full mt-2" size="90"/>
                }
              
                <h6 className="mt-3 text-center">{'@'+user.name.toLowerCase()}</h6>
               
                
               {/* <FollowButton recipientId={user._id} requesterId={currentUser}/> */}

              </div>
              
            );
          })}
        </div>
      </div>
    </>
  );
}

export default People;
