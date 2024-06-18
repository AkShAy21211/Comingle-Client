import { MdOutlinePhotoLibrary } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import Avatar from "react-avatar";

type CreatePostProps = {
  fetchPost(): Promise<void>;
};
function CreatePost({ fetchPost }: CreatePostProps) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <div
        className={` hidden h-24 lg:flex mt-32 ${
          isDarkMode ? "bg-black border" : "bg-gray-100"
        } items-center   mx-auto shadow-md rounded-xl border-gray-600  lg:w-3/5 mb-20  `}
      >
        {currentUser.profile ? (
          <img
            className="h-8 w-8 mx-5 rounded-full"
            src={currentUser.profile}
            alt=""
          />
        ) : (
          <Avatar size="35" className="rounded-full mx-5" name={currentUser.name} />
        )}
        <input
          type="tel"
          onClick={() => setOpenModal(true)}
          id="newPost"
          className={`bg-gray-50 border  border-gray-300 text-gray-900 ${
            isDarkMode ? "bg-gray-900" : ""
          } text-sm mx-5 rounded-full focus:ring-blue-500 focus:border-blue-500  w-72 p-2.5 h-10`}
          placeholder="Type something"
        />
        <div className=" flex w-32 ml-20 gap-3">
          <MdOutlinePhotoLibrary size={20} />
          <LuSendHorizonal size={20} />
        </div>
      </div>
      {openModal && (
        <CreatePostModal fetchPost={fetchPost} setOpenModal={setOpenModal} />
      )}
    </>
  );
}

export default CreatePost;
