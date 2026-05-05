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
          className={`fixed bottom-4 left-1/2 z-50 h-16 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[24px] border px-2 shadow-[0_24px_55px_-25px_rgba(15,23,42,0.45)] lg:hidden ${
            isDarkMode ? "border-white/10 bg-slate-900/92 text-white backdrop-blur-xl" : "border-white/70 bg-white/90 backdrop-blur-xl"
          }`}
        >
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <Link
              to="/"
              type="button"
              className="inline-flex flex-col items-center justify-center rounded-2xl px-3 group"
            >
              <PiSquaresFour size={30} />
              <span className="not-sr-only text-[11px] font-medium">Feeds</span>
            </Link>

            <Link
              to="/chats"
              data-tooltip-target="tooltip-wallet "
              type="button"
              className="inline-flex flex-col items-center justify-center px-3"
            >
              <BsChatLeftText size={20} />
              <span className="not-sr-only mt-1 text-[11px] font-medium">Chats</span>
            </Link>

            <div className="flex items-center justify-center">
              <button
                // disabled={!shoPostButton.includes(location.pathname)}
                data-tooltip-target="tooltip-new"
                type="button"
                onClick={handleShowmodal}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${
                  isDarkMode ? "bg-white/10" : "bg-slate-100"
                } group `}
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
              className="inline-flex flex-col items-center justify-center px-3 group"
            >
              <MdOutlineExplore size={30} />
              <span className="not-sr-only text-[11px] font-medium">Explore</span>
            </Link>

            <Link
              to="/settings"
              data-tooltip-target="tooltip-profile"
              type="button"
              className="inline-flex flex-col items-center justify-center px-3 rounded-e-full group"
            >
              <IoSettingsOutline size={30} />
              <span className="not-sr-only text-[11px] font-medium">Settings</span>
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
