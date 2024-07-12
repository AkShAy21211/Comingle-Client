import { DebouncedFunc } from "lodash";
import { IoSearch } from "react-icons/io5";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";


type ExpandableSearchBarProps={

  isFocused:boolean;
  setIsFocused:React.Dispatch<React.SetStateAction<boolean>>;
  searchUsers:DebouncedFunc<(name: any) => Promise<void>>;

}

function ExpandableSearchBar({isFocused,setIsFocused,searchUsers}:ExpandableSearchBarProps) {
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);



  return (

  
    <>
       <form className=" w-full  h-4" noValidate>
          <label className="mb-2 text-sm font-medium  sr-only dark:text-white">
            Search
          </label>
          <div className="relative  rounded-lg">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
            <input
            onChange={(e)=>searchUsers(e.target.value)}
              type="search"
              id="default-search"
              autoComplete="false"
              className={`block ${isFocused?'w-full':'lg:w-full'}  w-full transition-all duration-500 ease-in-out ${isDarMode?"bg-black":"bg-gray-200"} md:w-full p-4 h-10 ps-10 text-sm outline-none rounded-lg  placeholder:text-gray-600`}
              placeholder="Search....."
              onFocus={()=>setIsFocused(true)}
              // onBlur={()=>setIsFocused(false)}
              required
            />
            <button
              type="submit"
              className={` absolute end-auto bottom-2.5  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1`}
            >
              <IoSearch className={`text-black" size={20} ${isDarMode?'text-white':"text-black"}`} />
            </button>
          </div>
        </form>
    </>
  )
}

export default ExpandableSearchBar
