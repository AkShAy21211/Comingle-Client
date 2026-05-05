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
      <div className="app-page pt-6">
        <div className="mx-auto grid h-auto max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => {
            return (
              <div
                key={user._id}
                className="app-panel flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-3 px-5 py-6 text-center transition duration-300 hover:-translate-y-1"
                onClick={isAdminView?()=>handleViewUser(user._id):()=>navigate(`/profile/${user.username}`)}
              >
                {
                  user?.profile.image?  <img
                  src={user.profile.image}
                  className={`${isAdminView?'h-28 w-28':'h-20 w-20'} rounded-[28px] object-cover ring-4 ring-white/70`}
                  alt={user.name}
                />:<Avatar name={user.name} className="rounded-[28px]" size={isAdminView?'112':'80'}/>
                }
              
                <div>
                  <h6 className="text-center text-base font-semibold">{user.username.toLowerCase()}</h6>
                  <p className="mt-1 text-sm app-muted">{user.name}</p>
                </div>
              </div>
              
            );
          })}
          <h2 className="px-3 mt-1 text-sm app-muted">{!users.length?'No matches found':""}</h2>
        </div>
      </div>
      {
        (isAdminView && showUserModal && user) && <ViewUserModal  setSelectedUser={setShowUserModal} user={user} fetchUsers={function (): Promise<void> {
          throw new Error("Function not implemented.");
        } } />
      }
    </>
  );
}

export default People;
