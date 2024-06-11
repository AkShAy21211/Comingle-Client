import React, { ReactNode } from "react";
import Header from "./Header";
import SideBar from "./SideBar";



type LayoutPro={

    children:ReactNode
}

function Layout({ children }:LayoutPro) {
  return (
    <>
      <Header />
      {children}
      <SideBar />
    </>
  );
}

export default Layout;
