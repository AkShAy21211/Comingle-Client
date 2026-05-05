import { MdOutlinePhotoLibrary } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { SetStateAction, useState } from "react";
import CreatePostModal from "./CreatePostModal";
import Avatar from "react-avatar";

type CreatePostProps = {
  setfetchAgain:React.Dispatch<SetStateAction<boolean>>;
  fetchAgain:boolean;
};
function CreatePost({ setfetchAgain,fetchAgain}: CreatePostProps) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <div
        className={`hidden h-[6.5rem] lg:flex items-center mx-auto rounded-[28px] w-full max-w-[860px] mb-8 transition-all duration-300 border ${
          isDarkMode ? "bg-slate-900/60 border-white/5 shadow-glass backdrop-blur-md" : "bg-white/80 border-gray-100 shadow-soft backdrop-blur-md"
        }`}
      >
        {currentUser?.profile ? (
          <img
            className="h-10 w-10 mx-5 object-cover rounded-full"
            src={currentUser.profile}
            alt=""
          />
        ) : (
          <Avatar size="35" className="rounded-full mx-5" name={currentUser.name} />
        )}
        <div className="flex-1 px-4 relative">
          <input
            type="text"
            onClick={() => setOpenModal(true)}
            id="newPost"
            autoComplete="off"
            className={`w-full rounded-2xl border-none p-3.5 pl-5 text-[15px] cursor-pointer transition-colors duration-300 ${
              isDarkMode ? "bg-white/5 hover:bg-white/10 text-gray-200 placeholder-gray-500" : "bg-gray-50 hover:bg-gray-100 text-gray-800 placeholder-gray-400"
            } focus:ring-0`}
            placeholder="Share what's on your mind..."
            readOnly
          />
        </div>
        <div className="flex items-center gap-4 pr-6 text-gray-400">
          <button className={`p-2.5 rounded-xl transition-colors duration-300 ${isDarkMode ? 'hover:bg-white/10 hover:text-custom-teal' : 'hover:bg-custom-teal/10 hover:text-custom-teal'}`}>
            <MdOutlinePhotoLibrary size={22} />
          </button>
          <button className={`p-2.5 rounded-xl transition-colors duration-300 ${isDarkMode ? 'hover:bg-white/10 hover:text-custom-blue' : 'hover:bg-custom-blue/10 hover:text-custom-blue'}`}>
            <LuSendHorizonal size={22} />
          </button>
        </div>
      </div>
      {openModal && (
        <CreatePostModal setfetchAgain={setfetchAgain} fetchAgain={fetchAgain} setOpenModal={setOpenModal} />
      )}
    </>
  );
}

export default CreatePost;
