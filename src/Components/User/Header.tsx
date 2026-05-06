import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
import { FaRegBell } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import LogoutModal from "../Common/LogoutModal";
import userApi from "../../Apis/user";
import { useSelector } from "react-redux";
import { persistor, RootState } from "../../Redux/store";
import Avatar from "react-avatar";
import { Bounce, toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { connectToSocket } from "../../Apis/socket";

function Header() {
  const socket = connectToSocket();
  const [profileMenue, setProfileMenu] = useState(false);
  const handleProfileToogle = () => setProfileMenu(!profileMenue);
  const [logoutMdal, setLogoutModal] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 992px)");
  const [noti, setNotifications] = useState<number>(0);
  const currentUser: any = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const navigate = useNavigate();
  const location = useLocation();

  //////////////////////  GET ALL NOTIFICATIONS ///////////////////////

  async function getNotification() {
    try {
      await userApi.notifications();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getNotification();
    setNotifications(0);
  }, []);

  const handleNotification = () => {
    setNotifications((prev) => prev + 1);
  };

  useEffect(() => {
    if (location.pathname === "/notifications") {
      setNotifications(0);
    }
  }, [location.pathname]);

  const handleUserBlocked = (data: { reason: string }) => {
    toast.warning(data.reason, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    localStorage.clear();
    persistor.purge();
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  };

  const handleCall = () => {
    navigate("/chats");
  };
  useEffect(() => {
    socket.on("user_blocked", handleUserBlocked);

    socket.on("notification", handleNotification);
    socket.on("call", handleCall);

    return () => {
      socket.off("user_blocked", handleUserBlocked);
      socket.off("notification", handleNotification);
      socket.off("call", handleCall);
    };
  }, [handleUserBlocked, handleNotification, handleCall]);

  useEffect(() => {
    const closeMenu = () => setProfileMenu(false);
    if (profileMenue) {
      window.addEventListener("click", closeMenu);
    }

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [profileMenue]);

  return (
    <>
      <nav className={`top-0 fixed w-full z-50 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/80 border-white/10 backdrop-blur-xl' : 'bg-white/65 border-white/60 backdrop-blur-2xl shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]'}`}>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-[4.75rem] items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/" className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-sky-100 bg-white/80 text-custom-blue shadow-[0_12px_30px_-20px_rgba(14,116,144,0.7)]"}`}>
                    <HiSparkles size={20} />
                  </div>
                  <div>
                    <h1 className={`font-display text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Comingle
                    </h1>
                    <p className={`hidden text-xs sm:block ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Connect, share, and stay in the loop
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Link
                to="/notifications"
                className={`relative rounded-2xl border p-3 transition-all duration-300 ${isDarkMode ? 'border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'border-slate-200/70 bg-white/80 text-gray-500 hover:-translate-y-0.5 hover:text-custom-blue hover:shadow-[0_18px_34px_-22px_rgba(15,76,129,0.7)]'} focus:outline-none`}
              >
                {noti ? (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg">
                    {noti ? noti : null}
                  </span>
                ) : (
                  ""
                )}
                <FaRegBell size={23} />
              </Link>

              <div className="relative  ml-3">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileToogle();
                    }}
                    type="button"
                    className={`relative flex items-center gap-3 rounded-full border px-1.5 py-1.5 transition-transform hover:scale-[1.02] duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'border-white/10 bg-white/5 focus:ring-white focus:ring-offset-gray-800' : 'border-slate-200/80 bg-white/85 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.7)] focus:ring-custom-blue focus:ring-offset-white'}`}

                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {currentUser?.profile?.image ? (
                      <img
                        className="h-9 w-9 rounded-full object-cover"
                        src={currentUser.profile.image}
                        alt=""
                      />
                    ) : (
                      <Avatar
                        size="35"
                        className="rounded-full"
                        name={currentUser.name}
                      />
                    )}
                    <div className="hidden pr-2 text-left md:block">
                      <p className={`max-w-32 truncate text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                        {currentUser?.name}
                      </p>
                      <p className={`max-w-32 truncate text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {currentUser?.username}
                      </p>
                    </div>
                    {isSmallScreen ? (
                      <Link to="/profile" className="absolute inset-0 z-50" />
                    ) : null}
                  </button>
                </div>

                {profileMenue && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute hidden lg:block right-0 z-[80] mt-3 border w-56 rounded-2xl ${
                      isDarkMode ? "bg-slate-950 border-white/10 text-white shadow-[0_28px_50px_-28px_rgba(0,0,0,0.85)]" : "bg-white border-slate-100 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.45)]"
                    } py-2 overflow-hidden ring-black ring-opacity-5 focus:outline-none transition-all duration-200 origin-top-right`}

                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenu(false)}
                      className={`flex gap-3 items-center px-4 py-3 text-sm transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50 text-gray-700'}`}
                      role="menuitem"
                      id="user-menu-item-0"
                    >
                      <CgProfile size={20} /> Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenu(false)}
                      className={`flex gap-3 items-center px-4 py-3 text-sm transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50 text-gray-700'}`}
                      role="menuitem"
                      id="user-menu-item-1"
                    >
                      <IoSettingsOutline size={20} /> Settings
                    </Link>
                    <Link
                      to="#"
                      onClick={() => {
                        setLogoutModal(true);
                        setProfileMenu(false);
                      }}
                      className={`flex gap-3 items-center px-4 py-3 text-sm transition-colors ${isDarkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                      role="menuitem"
                      id="user-menu-item-2"
                    >
                      <IoLogOutOutline size={20} /> Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {logoutMdal && <LogoutModal setLogoutModal={setLogoutModal} />}{" "}
    </>
  );
}

export default Header;
