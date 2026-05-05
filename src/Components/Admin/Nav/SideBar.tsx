import  { useState } from "react";
import classNames from "classnames";
import Header from "./Header";
import { RiDashboardHorizontalLine } from "react-icons/ri";
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
  const dispatch = useDispatch();

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
            className="absolute left-14 hover:cursor-pointer top-6 z-50 whitespace-normal break-words rounded-lg bg-black py-1.5 px-3 text-sm text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
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
      <div className="fixed z-50 flex min-h-screen flex-col items-center justify-center py-2">
        <div
          className={classNames(
            "fixed left-0 top-20 z-40 h-full w-72 border-r border-white/10 bg-slate-900/92 p-8 pl-10 text-white shadow-2xl backdrop-blur-xl transition-transform",
            {
              "transform translate-x-0": showSidebar,
              "transform -translate-x-full": !showSidebar,
            }
          )}
        >
          <ul className="relative mt-4 space-y-4">
            <li></li>
            <li className="rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
              <Link to="/admin/dashboard" className="flex">
                <RiDashboardHorizontalLine size={30}/>
                <p className="mx-4 m-1">Dashboard</p>
              </Link>
            </li>
            <li className="rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
              <Link to="/admin/users" className="flex">
                <MdOutlinePeopleAlt size={30} />
                <p className="mx-4 m-1">Users</p>
              </Link>
            </li>
            <li className="rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
              <Link to="/admin/posts" className="flex">
                <GoFileMedia size={30} />
                <p className="mx-4 m-1">Contents</p>
              </Link>
            </li>
            <li className="rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
              <Link to="/admin/premium" className="flex">
                <TbPremiumRights size={30} />
                <p className="mx-4 m-1">Premium</p>
              </Link>
            </li>
            <li className="rounded-2xl border border-transparent bg-red-500/10 p-3 transition hover:border-red-300/40 hover:bg-red-500/20">
              <Link
                to="/admin/login"
                onClick={() => {
                  dispatch(adminLogout());
                  persistor.purge();
                  
                }}
                className="flex"
              >
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
