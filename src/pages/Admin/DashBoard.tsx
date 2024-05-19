import React from "react";
import SideBar from "../../Components/Admin/NavBar/SideBar";
import SectionOne from "../../Components/Admin/DashBoard/SectionOne";
import SectionTwo from "../../Components/Admin/DashBoard/SectionTwo";
import SectionThree from "../../Components/Admin/DashBoard/SectionThree";

function DashBoard() {
  return (
    <div>
      <SideBar />
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
    </div>
  );
}

export default DashBoard;
