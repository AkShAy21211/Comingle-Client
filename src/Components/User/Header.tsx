import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
import { FaRegBell } from "react-icons/fa6";
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
  const [notifications, setNotifications] = useState<number | null>(0);
  const currentUser:any = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  
  //////////////////////  GET ALL NOTIFICATIONS ///////////////////////

  async function getNotification() {
    try {
      const notifications = await userApi.notifications();

      if (notifications) {
        setNotifications(notifications.length);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getNotification();
  }, []);

  const handleNotification = () => {
    getNotification();
  };

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

  useEffect(() => {
    socket.on("user_blocked", handleUserBlocked);

    socket.on("notification", handleNotification);

    return () => {
      socket.off("user_blocked", handleUserBlocked);
      socket.off("notification", handleNotification);
    };
  }, [handleUserBlocked, handleNotification]);

  return (
    <>
      <nav className="bg-custom-blue top-0 fixed w-full z-50">
        <div className="mx-auto w-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex  sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-white font-bold text-xl">Comingle</h1>
              </div>
              {/* <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">

            <Link to="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Calendar</Link>
          </div>
        </div> */}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Link
                to="/notifications"
                className="relative rounded-fullp-1  text-gray-400 hover:text-white focus:outline-none  focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {notifications && notifications > 0 ? (
                  <span className="absolute inset-x-2  flex justify-center items-center -inset-2 w-5 h-5 rounded-full bg-yellow-500 text-white text-sm">
                    {notifications ? notifications : null}
                  </span>
                ) : (
                  ""
                )}
                <FaRegBell size={23} />
              </Link>

              <div className="relative  ml-3">
                <div>
                  <button
                    onClick={handleProfileToogle}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {currentUser?.profile ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser?.profile}
                        alt=""
                      />
                    ) : (
                      <Avatar
                        size="35"
                        className="rounded-full"
                        name={currentUser.name}
                      />
                    )}
                    {isSmallScreen ? (
                      <Link to="/profile" className="absolute inset-0 z-50" />
                    ) : null}
                  </button>
                </div>

                {profileMenue && (
                  <div
                    className={`absolute hidden lg:block  right-0 z-10 mt-2 border w-48  rounded-md ${
                      isDarkMode ? " backdrop-blur-lg text-white" : "bg-white"
                    } py-1 shadow-lg   ring-black ring-opacity-5 focus:outline-none`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenu(false)}
                      className=" flex gap-2  focus:bg-custom-blue focus:text-white  active:bg-custom-blue active:text-white px-4 py-2 text-sm "
                      role="menuitem"
                      id="user-menu-item-0"
                    >
                      <CgProfile size={20} /> Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenu(false)}
                      className="flex gap-2  focus:bg-custom-blue focus:text-white   active:bg-custom-blue active:text-white px-4 py-2 text-sm "
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
                      className="flex gap-2  focus:bg-custom-blue focus:text-white   active:bg-custom-blue active:text-white px-4 py-2 text-sm "
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
