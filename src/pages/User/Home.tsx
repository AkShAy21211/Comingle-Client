import React from "react";
import LeftPanel from "../../Components/User/Panel/LeftPanel";
import RightPanel from "../../Components/User/Panel/RightPanel";
import Header from "../../Components/User/Nav/Header";
import MobileBottomNav from "../../Components/User/Nav/MobileBottomNav";
import Posts from "../../Components/User/Post/Posts";
function Home() {
  return (
    <>
      <Header />
      <div className="flex justify-between ">
        <LeftPanel />
        <Posts />
        <RightPanel />
      </div>
      <MobileBottomNav />
    </>
  );
}
export default Home;
