import { DebouncedFunc } from "lodash";
import { IoSearch } from "react-icons/io5";


type ExpandableSearchBarProps={

  isFocused:boolean;
  setIsFocused:React.Dispatch<React.SetStateAction<boolean>>;
  searchUsers:DebouncedFunc<(name: any) => Promise<void>>;

}

function ExpandableSearchBar({isFocused,setIsFocused,searchUsers}:ExpandableSearchBarProps) {




  return (

  
    <>
       <form className=" w-full  h-4" noValidate>
          <label className="mb-2 text-sm font-medium  sr-only dark:text-white">
            Search
          </label>
          <div className="relative border rounded-lg">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
            <input
            onChange={(e)=>searchUsers(e.target.value)}
              type="search"
              id="default-search"
              className={`block ${isFocused?'w-full':'w-48'} transition-all duration-500 ease-in-out md:w-full p-4 h-10 ps-10 text-sm outline-none rounded-lg  placeholder:text-gray-600`}
              placeholder="Search....."
              onFocus={()=>setIsFocused(true)}
              onBlur={()=>setIsFocused(false)}
              required
            />
            <button
              type="submit"
              className={`text-white absolute end-auto bottom-2.5  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-0`}
            >
              <IoSearch className="text-black" size={20} />
            </button>
          </div>
        </form>
    </>
  )
}

export default ExpandableSearchBar
