import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import UserDetails from "../../Components/User/UserDetails";

function PersonalDetails() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className="col-span-full lg:col-start-2 lg:col-end-3">
      <div className="app-page pt-0">
        <div className={`app-panel mx-auto max-w-[860px] p-5 sm:p-8 ${isDarkMode ? "border-white/10 bg-slate-900/60 text-white" : ""}`}>
          <div className="mb-8">
            <span className="app-chip">Profile</span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Personal details</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Keep your profile information up to date.
            </p>
          </div>
          <UserDetails />
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
