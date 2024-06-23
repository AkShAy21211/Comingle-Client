import React, { Fragment, useState } from "react";
import RecentChats from "../../Components/User/RecentChats";
import SingleChat from "../../Components/User/SingleChat";
import Header from "../../Components/User/Header";

function Chat() {

  const [fetchAgain,setFetchAgain] = useState(false);
  return (

   <Fragment>
    <Header/>
     <div className="grid  grid-cols-4">
      <RecentChats  fetchAgain={fetchAgain} />
      <SingleChat  setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>
    </div>
   </Fragment>
  );
}

export default Chat;
