import { PiSquaresFour } from "react-icons/pi";
import { BsChatLeftText } from "react-icons/bs";
import { Link } from "react-router-dom";
import Suggestions from "./Suggestions";
import Settings from "./Settings";
import { useSelector } from "react-redux";
import { MdOutlineExplore } from "react-icons/md";
import { RootState } from "../../Redux/store";
import { useLocation } from "react-router-dom";

function LeftPanel({ isProfile }: { isProfile?: boolean }) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const location = useLocation();
  const links = [
    { to: "/", label: "Feeds", icon: PiSquaresFour },
    { to: "/chats", label: "Chat", icon: BsChatLeftText },
    { to: "/explore", label: "Explore", icon: MdOutlineExplore },
  ];

  return (
    <div
      className={`sticky top-24 hidden self-start lg:col-span-1 lg:block`}
    >
      <div
        className={`app-panel mx-auto flex max-h-[calc(100vh-7.5rem)] w-full max-w-[264px] flex-col overflow-hidden ${
          isDarkMode ? "border-white/10 bg-slate-900/60 text-white" : ""
        }`}
      >
        <div className="flex-1 p-6">
          <div className="mb-5">
            <span className="app-chip">Navigation</span>
          </div>
          <ul className="space-y-2 text-[15px] font-medium tracking-wide">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to} className="rounded-2xl overflow-hidden">
                  <Link
                    rel="noopener noreferrer"
                    to={to}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? isDarkMode
                          ? "bg-white/10 text-white shadow-[0_10px_24px_-18px_rgba(255,255,255,0.6)]"
                          : "bg-gradient-to-r from-custom-blue to-custom-teal text-white shadow-[0_18px_36px_-24px_rgba(15,76,129,0.9)]"
                        : isDarkMode
                          ? "text-gray-300 hover:bg-white/10 hover:text-white"
                          : "text-gray-600 hover:bg-slate-100/80 hover:text-custom-blue"
                    }`}
                  >
                    <Icon size={24} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={`border-t px-6 py-5 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
          {isProfile ? (
            <Settings />
          ) : (
            <Suggestions />
          )}
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;
