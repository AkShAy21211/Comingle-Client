import { PiSquaresFour } from "react-icons/pi";
import { BsChatLeftText } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { MdOutlineExplore } from "react-icons/md";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import CreatePostModal from "./CreatePostModal";
function MobileBottomNav() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [openModal, setOpenModal] = useState(false);
  const shoPostButton = ["/"];
  const showNav = ["/chats"];
  const location = useLocation();
  const navigate = useNavigate();

  const handleShowmodal = () => {
    if (location.pathname !== shoPostButton[0]) {
      navigate("/");
    }
    setOpenModal(true);
  };

  return (
    <>
      {!showNav.includes(location.pathname) && (
        <div
          className={`fixed lg:hidden z-50  h-16 w-full -translate-x-1/2 ${
            isDarkMode ? "bg-custom-blue text-white" : " bg-white border "
          }   bottom-0  left-1/2 `}
        >
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <Link
              to="/"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-s-full :hover:bg-custom-blue group"
            >
              <PiSquaresFour size={30} />
              <span className="not-sr-only text-sm">Feeds</span>
            </Link>

            <Link
              to="/chats"
              data-tooltip-target="tooltip-wallet "
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 mt-1group"
            >
              <BsChatLeftText size={20} />
              <span className="not-sr-only text-sm mt-1">Chats</span>
            </Link>

            <div className="flex items-center justify-center">
              <button
                // disabled={!shoPostButton.includes(location.pathname)}
                data-tooltip-target="tooltip-new"
                type="button"
                onClick={handleShowmodal}
                className={`inline-flex items-center justify-center ${
                  isDarkMode ? "bg-custom-blue" : ""
                } w-10 h-10 font-mediumrounded-full group `}
              >
                <AiFillPlusCircle
                  className={`${
                    isDarkMode ? "text-white" : "text-custom-blue"
                  }`}
                  size={40}
                />
              </button>
            </div>

            <Link
              to="/explore"
              data-tooltip-target="tooltip-settings"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5  group"
            >
              <MdOutlineExplore size={30} />
              <span className="not-sr-only text-sm">Explore</span>
            </Link>

            <Link
              to="/settings"
              data-tooltip-target="tooltip-profile"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-e-full   group"
            >
              <IoSettingsOutline size={30} />
              <span className="not-sr-only text-sm">Settings</span>
            </Link>

            {}
          </div>
        </div>
      )}
      {openModal && (
        <CreatePostModal isMobile={true} setOpenModal={setOpenModal} />
      )}
    </>
  );
}

export default MobileBottomNav;
