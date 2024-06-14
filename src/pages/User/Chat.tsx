import React, { Fragment } from "react";
import RecentChats from "../../Components/User/RecentChats";
import SingleChat from "../../Components/User/SingleChat";
import Header from "../../Components/User/Header";

function Chat() {
  return (

   <Fragment>
    <Header/>
     <div className="grid  grid-cols-4">
      <RecentChats />
      <SingleChat />
    </div>
   </Fragment>
  );
}

export default Chat;
