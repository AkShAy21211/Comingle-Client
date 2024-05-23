import { MdOutlinePhotoLibrary } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
function CreatePost() {

    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className={` hidden h-24 lg:flex mt-32 ${isDarkMode?'bg-black border':'bg-gray-100'} items-center shadow-md rounded-xl border-gray-600  lg:w-3/5 mb-20  `}>
       <img
            className="w-10 h-10 m-7 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Rounded avatar"
          />
        <input type="tel" id="newPost" className={`bg-gray-50 border  border-gray-300 text-gray-900 ${isDarkMode?'bg-gray-900':''} text-sm rounded-full focus:ring-blue-500 focus:border-blue-500  w-72 p-2.5 h-10`} placeholder="Type something"  />
        <div className=" flex w-32 ml-20 gap-3">
          <MdOutlinePhotoLibrary size={20}/>
        <LuSendHorizonal size={20}/>
        </div>

    </div>
  )
}

export default CreatePost