import { PiSquaresFour } from "react-icons/pi";
import { BsChatLeftText } from "react-icons/bs";
import { BsPersonAdd } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { MdOutlineExplore } from "react-icons/md";
function MobileBottomNav() {
      const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className={`fixed lg:hidden z-50  h-16 w-full -translate-x-1/2 ${isDarkMode?'bg-custom-blue text-white':' bg-white border '}   bottom-0  left-1/2 `}>
    <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <Link to="/"  type="button" className="inline-flex flex-col items-center justify-center px-5 rounded-s-full :hover:bg-custom-blue group">
            <PiSquaresFour size={30}/>
            <span className="not-sr-only text-sm">Feeds</span>
        </Link>
       
        <Link to="" data-tooltip-target="tooltip-wallet " type="button" className="inline-flex flex-col items-center justify-center px-5 mt-1group">
           <BsChatLeftText size={20}/>
            <span className="not-sr-only text-sm mt-1">Chats</span>
        </Link>
       

        <div className="flex items-center justify-center">
            <button data-tooltip-target="tooltip-new" type="button" className={`inline-flex items-center justify-center ${isDarkMode?'bg-white':''} w-10 h-10 font-medium bg-custom-blue rounded-full group `}>
                <svg className={` ${isDarkMode?'text-black':'text-white'} w-4 h-4 `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
            </button>
        </div>
       
{/* 
        <Link to="" data-tooltip-target="tooltip-settings" type="button" className="inline-flex flex-col items-center justify-center px-5  group">
           <BsPersonAdd size={30}/>
            <span className="not-sr-only text-sm">Request</span>
        </Link> */}
       
       <Link to="/explore" data-tooltip-target="tooltip-settings" type="button" className="inline-flex flex-col items-center justify-center px-5  group">
           <MdOutlineExplore size={30}/>
            <span className="not-sr-only text-sm">Explore</span>
        </Link>

        <Link to="/settings" data-tooltip-target="tooltip-profile" type="button" className="inline-flex flex-col items-center justify-center px-5 rounded-e-full   group">
            <IoSettingsOutline size={30}/>
            <span className="not-sr-only text-sm">Settings</span>
        </Link>
        
        {

        }
    </div>
</div>
  )
}

export default MobileBottomNav
