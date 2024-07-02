import React, { useRef, useState } from "react";
import userApi from "../../Apis/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { updateUser } from "../../Redux/Slice/User/userSlice";
import { CgSpinner } from "react-icons/cg";

type ProfileModalProp = {
  showDpModal: boolean;
  showCoverModal: boolean;
  setShowCoverMdal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDpMdal: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileModal: React.FC<ProfileModalProp> = ({
  showCoverModal,
  showDpModal,
  setShowDpMdal,
  setShowCoverMdal,
  setFetchAgain,
}) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();
  const bgRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  //////////////// OPEN FILE INPUT /////////////////////

  const changeCover = () => {
    bgRef.current?.click();
  };

  const changeDp = () => {
    profileRef.current?.click();
  };

  ///////////// HANDLE FILE INPUT ////////////////////////////////

  const [cover, setCover] = useState<File | null>(null);
  const [DP, setDP] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length) {
      if (name === "background") {
        setCover(files[0]);
      } else {
        setDP(files[0]);
      }
    }
  };

  /////////// HANDLE FILE UPPLOAD //////////////////////////////

  const handleSubmit = async (type: string) => {
    const formData = new FormData();

    if (type === "background" && cover) {
      formData.append("image", cover);
      formData.append("type", "background");
    } else if (type === "profile" && DP) {
      formData.append("image", DP);
      formData.append("type", "profile");
    }
    setLoading(true);
    try {
      const fileUploadResponse = await userApi.updateProfileImage(
        type,
        formData
      );

      if (fileUploadResponse?.status) {
        setFetchAgain(true);
        type === "background" ? setShowCoverMdal(false) : setShowDpMdal(false);
        dispatch(updateUser(fileUploadResponse.data.user.profile.image));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {(showCoverModal || showDpModal) && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-xl  border-white">
              <div
                className={`border-0 rounded-lg shadow-lg ${
                  isDarkMode
                    ? "bg-custom-blue/40  backdrop-blur-xl text-white"
                    : "bg-white"
                } relative flex flex-col w-full outline-none focus:outline-none`}
              >
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold txtb">Edit</h3>
                  <button
                    className="p-1 ml-auto  border-0  float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={
                      showCoverModal
                        ? () => setShowCoverMdal(false)
                        : () => setShowDpMdal(false)
                    }
                  >
                    X
                  </button>
                </div>

                <div className="relative p-6 flex flex-col justify-center items-center">
                  {showCoverModal && (
                    <div
                      className={`w-full h-20 cursor-pointer ${
                        isDarkMode ? "bg-black" : "bg-gray-200"
                      } flex items-center p-4 justify-center text-gray-500`}
                      onClick={changeCover}
                    >
                      {cover ? (
                        <img
                          className="object-cover w-full h-full"
                          src={URL.createObjectURL(cover)}
                          alt="Background"
                        />
                      ) : (
                        <span>Click to upload background image</span>
                      )}
                    </div>
                  )}
                  {showDpModal && (
                    <div
                      className={`w-52 h-52 rounded-full cursor-pointer mt-4 ${
                        isDarkMode ? "bg-black" : "bg-gray-200"
                      } p-5  flex items-center justify-center text-gray-500`}
                      onClick={changeDp}
                    >
                      {DP ? (
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={URL.createObjectURL(DP)}
                          alt="Profile"
                        />
                      ) : (
                        <span className="text-sm text-center">
                          Click to upload profile image
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {/* <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowDpMdal(false)}
                  >
                    Close
                  </button> */}
                  <button
                    className={`bg-custom-blue  w-full flex justify-center text-whitefont-bold  text-white uppercase text-sm text-center px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="submit"
                    onClick={() =>
                      handleSubmit(
                        `${showCoverModal ? "background" : "profile"}`
                      )
                    }
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin " size={20} />
                    ) : (
                      " Update"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      <input
        type="file"
        id="bgRef"
        className="hidden"
        name="background"
        ref={bgRef}
        onChange={handleChange}
      />
      <input
        type="file"
        id="profileRef"
        className="hidden"
        name="profile"
        ref={profileRef}
        onChange={handleChange}
      />
    </>
  );
};

export default ProfileModal;
