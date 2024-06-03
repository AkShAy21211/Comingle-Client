import React, { useState } from "react";
import classNames from "classnames";
import Header from "./Header";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { TbPremiumRights } from "react-icons/tb";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../../Redux/Slice/Admin/adminSlice";
import { persistor } from "../../../Redux/store";

function SideBar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch()
  return (
    <>
      {showSidebar ? (
        <>
          <button
            data-tooltip-target="tooltip"
            aria-label="Close sidebar"
            className="flex text-4xl text-white items-center cursor-pointer fixed left-8 top-4 z-50"
            onClick={() => setShowSidebar(false)}
          >
            x
          </button>
          <div
            id="tooltip"
            className="absolute left-14 hover:cursor-pointer  top-6 z-50 whitespace-normal break-words rounded-lg bg-black py-1.5 px-3 text-sm text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
          >
            Close sidebar
          </div>
        </>
      ) : (
        <svg
          aria-label="Open sidebar"
          onClick={() => setShowSidebar(true)}
          className="fixed z-50 flex items-center cursor-pointer left-8 top-5"
          fill="#ffff"
          viewBox="0 0 100 80"
          width="30"
          height="30"
        >
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      )}
      <Header />
      <div className="flex z-50 flex-col fixed items-center justify-center min-h-screen py-2">
       <div
  className={classNames(
    "top-20 border-t left-0 w-64 shadow-white  backdrop-blur-sm bg-custom-blue/90 p-10 pl-20 text-white fixed h-full z-40 transition-transform",
    {
      "transform translate-x-0": showSidebar,
      "transform -translate-x-full": !showSidebar,
    }
  )}
>

          <ul className="space-y-10 mt-4 relative -space-x-10">
            <li></li>
            <li className="hover:border hover:border-white border border-transparent  p-3 rounded-lg active:bg-white focus-within:text-custom-blue focus-within:bg-white ">
              <Link to="" className="flex">
                <MdOutlineDashboard size={30} />
              <p className="mx-4 m-1">DashBoard</p></Link>
            </li>
            <li className="hover:border hover:border-white border border-transparent  p-3 rounded-lg  active:bg-white focus-within:text-custom-blue focus-within:bg-white">
              <Link to="" className="flex">
                <MdOutlinePeopleAlt size={30} />
                <p className="mx-4 m-1">Users</p>
              </Link>
            </li>
            <li className="hover:border hover:border-white border border-transparent  p-3 rounded-lg active:bg-white focus-within:text-custom-blue focus-within:bg-white">
              <Link to="" className="flex">
                <GoFileMedia size={30} />
                <p className="mx-4 m-1">Contents</p>
              </Link>
            </li>
             <li className="hover:border hover:border-white border border-transparent  p-3 rounded-lg active:bg-white focus-within:text-custom-blue focus-within:bg-white">
              <Link to="" className="flex">
                <TbPremiumRights size={30} />
                <p className="mx-4 m-1">Premium</p>
              </Link>
            </li>
            <li className="hover:border hover:border-white border border-transparent  p-3 rounded-lg active:bg-white focus-within:text-custom-blue focus-within:bg-white">
              <Link to="" onClick={()=>{
                dispatch(adminLogout())
                persistor.purge()
              }} className="flex">
                <RiLogoutBoxRLine size={30} />
                <p className="mx-4 m-1">Logout</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBar;
