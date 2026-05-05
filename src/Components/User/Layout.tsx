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
  const showSettingsRail =
    isProflie ||
    location.pathname === "/settings" ||
    location.pathname === "/details" ||
    location.pathname === "/settings/subscription";

  return (
    <div className="app-shell">
      <Header />
      {showPlane!==location.pathname && (
        <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 px-3 pt-24 sm:px-5 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:gap-8 lg:px-6 lg:pt-28 xl:px-8">
          <LeftPanel isProfile={showSettingsRail} />
          {children}
          <RightPanel />
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
}

export default Layout;
