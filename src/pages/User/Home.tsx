import React from "react";
import LeftPanel from "../../Components/User/LeftPanel";
import RightPanel from "../../Components/User/RightPanel";
import Header from "../../Components/User/Header";
import MobileBottomNav from "../../Components/User/MobileBottomNav";
import Posts from "../../Components/User/Posts";
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
