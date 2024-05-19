import usersDymmy from "../../../Dummy/user";


function UserAvatar({suggestions,isRight}:{suggestions:string,isRight?:boolean}) {
  return (
    <>
     <h2 className="px-10 font-bold ">{suggestions}</h2>
      {usersDymmy.map((user) => (
        <div className={`${isRight?'flex justify-between space-x-4 mt-7 px-10':'flex  space-x-4 mt-7 px-10'}`}>
          <img
            className="w-6 h-6 rounded-full"
            src={user.image}
            alt="Rounded avatar"
          />
          <h2>{user.firstName}</h2>
          {
            isRight && <div className="w-2 h-2 bg-green-600 rounded-lg m-2"></div>
          }
        </div>
      ))}
    </>
  );
}

export default UserAvatar;
