import Avatar from "react-avatar";
import usersDymmy from "../../Dummy/user";



type UserAvatarProp={

  suggestions:string,
  isRight:boolean;
  friends?:any[]|[]
}

function UserAvatar({suggestions,isRight,friends}:UserAvatarProp) {
  return (
    <>
     <h2 className="px-10 font-bold ">{suggestions}</h2>
      {friends&&friends.map((user) => (
        <div className={`${isRight?'flex justify-between space-x-4 mt-7 px-10':'flex  space-x-4 mt-7 px-10'}`}>
         {
          user.profile.image? <img
            className="w-6 h-6 rounded-full"
            src={user.profile.image}
            alt="Rounded avatar"
          />:<Avatar name={user.name} size="25" className="rounded-full" />
         }
          <h2>{user.username}</h2>
          {
            isRight && <div className="w-2 h-2 bg-green-600 rounded-lg m-2"></div>
          }
        </div>
      ))}
    </>
  );
}

export default UserAvatar;
