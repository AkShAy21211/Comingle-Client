import { DebouncedFunc } from "lodash";
import { IoSearch } from "react-icons/io5";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";


type ExpandableSearchBarProps={
  setIsFocused:React.Dispatch<React.SetStateAction<boolean>>;
  searchUsers:DebouncedFunc<(name: any) => Promise<void>>;

}

function ExpandableSearchBar({setIsFocused,searchUsers}:ExpandableSearchBarProps) {
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);
  return (
    <>
      <form className="w-full" noValidate>
        <label className="sr-only text-sm font-medium dark:text-white">
          Search
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <IoSearch
              size={18}
              className={isDarMode ? "text-slate-400" : "text-slate-500"}
            />
          </span>
          <input
            onChange={(e) => searchUsers(e.target.value)}
            type="search"
            id="default-search"
            autoComplete="off"
            className={`block h-12 w-full rounded-2xl border pl-11 pr-4 text-sm outline-none transition-all duration-300 ${
              isDarMode
                ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400/30"
                : "border-slate-200 bg-slate-100 text-slate-800 placeholder:text-slate-500 focus:border-sky-300"
            }`}
            placeholder="Search chats or people"
            onFocus={() => setIsFocused(true)}
            required
          />
        </div>
      </form>
    </>
  );
}

export default ExpandableSearchBar
