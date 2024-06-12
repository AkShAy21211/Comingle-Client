import React, { useState } from "react";
import PostsBox from "../../Components/Common/Posts";

function Posts() {
  const [postedUser, setPostedUsers] = useState([]);

  
  const getPostedUser = (data: any) => {
    setPostedUsers(data);
      console.log('fewfwefef',postedUser);

  };
  return (
    <div className="mt-16">
      <PostsBox isAdminview getPostedUser={getPostedUser} allPosts={[]} />
      
    </div>
  );
}

export default Posts;
