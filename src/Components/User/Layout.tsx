import React from "react";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useLocation } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
  isProflie?: boolean;
};

function Layout({ children, isProflie }: LayoutProps) {
  const location = useLocation();
  const showPlane = "/chats";

  return (
    <>
      <Header />
      {showPlane!==location.pathname && (
        <div className="grid grid-cols-5">
          <LeftPanel isProfile={isProflie} />
          {children}
          <RightPanel />
        </div>
      )}
      <MobileBottomNav />
    </>
  );
}

export default Layout;
