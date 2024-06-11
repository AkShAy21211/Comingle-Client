import React from "react";
import SideBar from "../../Components/Admin/Nav/SideBar";
import SectionOne from "../../Components/Admin/DashBoard/SectionOne";
import SectionTwo from "../../Components/Admin/DashBoard/SectionTwo";
import SectionThree from "../../Components/Admin/DashBoard/SectionThree";

function DashBoard() {
  return (
    <>
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
    </>
  );
}

export default DashBoard;
