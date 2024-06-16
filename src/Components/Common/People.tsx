import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ViewUserModal from "../Admin/ViewUserModal";
import { User } from "../../Interface/interface";

type PeopleProps = {
  users: User[];
  isAdminView?:boolean;
};


function People({ users,isAdminView }: PeopleProps) {
    const [showUserModal,setShowUserModal] = useState(false);
    const [user,setUser] = useState<User|null>(null)
    const navigate = useNavigate();


    const handleViewUser = (id:string)=>{

      const findUser = users.find(user=>user._id===id);
      if(findUser){
        setUser(findUser);
        setShowUserModal(true)
      }
      
    }

   
    
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {

      

            return (
              <div
                key={user._id}
                className="w-full h-36 md:h-52 rounded-lg flex flex-col items-center cursor-pointer"
                onClick={isAdminView?()=>handleViewUser(user._id):()=>navigate(`/profile/${user.username}`)}
              >

                {
                  user?.profile.image?  <img
                  src={user.profile.image}
                  className={`${isAdminView?'w-36 h-36':'w-20 h-20'} rounded-full object-cover mt-5`}
                  alt={user.name}
                />:<Avatar name={user.name} className="rounded-full mt-2" size={isAdminView?'150':'90'}/>
                }
              
                <h6 className="mt-3 text-center">{user.username.toLowerCase()}</h6>
               
                
               {/* <FollowButton recipientId={user._id} requesterId={currentUser}/> */}

              </div>
              
            );
          })}
        </div>
      </div>
      {
        (isAdminView && showUserModal && user) && <ViewUserModal  setShowModal={setShowUserModal} user={user} />
      }
    </>
  );
}

export default People;
