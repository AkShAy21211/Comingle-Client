import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

function Settings() {
  const location = useLocation();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const items = [
    {
      to: "/details",
      label: "Personal Details",
      icon: CgProfile,
      active: location.pathname === "/details",
    },
    {
      to: "/settings",
      label: "Account Settings",
      icon: IoSettingsOutline,
      active: location.pathname === "/settings",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
          Settings
        </h2>
        <p className={`mt-1 text-sm leading-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Profile, preferences, and plan management.
        </p>
      </div>

      <ul className="space-y-2">
        {items.map(({ to, label, icon: Icon, active }) => (
          <li key={to}>
            <Link
              rel="noopener noreferrer"
              to={to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-custom-blue to-custom-teal text-white shadow-[0_18px_36px_-24px_rgba(15,76,129,0.9)]"
                  : isDarkMode
                    ? "text-slate-200 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Settings;
