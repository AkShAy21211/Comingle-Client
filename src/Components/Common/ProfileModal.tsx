import React, { useEffect, useRef, useState } from "react";
import userApi from "../../Apis/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { updateUser } from "../../Redux/Slice/User/userSlice";
import { CgSpinner } from "react-icons/cg";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
  const [cover, setCover] = useState<File | null>(null);
  const [DP, setDP] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({ aspect: 16 / 9 } as any);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [isCroping, setIsCroping] = useState(false);

  //////////////// OPEN FILE INPUT /////////////////////

  const changeCover = () => {
    bgRef.current?.click();
    setIsCroping(true);
  };

  const changeDp = () => {
    profileRef.current?.click();
    setIsCroping(true);
  };

  useEffect(() => {
    if (showCoverModal || showDpModal) {
      const file = showCoverModal ? cover : DP;
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        };
      }
    }
  }, [showCoverModal, showDpModal, cover, DP]);

  const onImageLoaded = (img: HTMLImageElement) => {
    setLoadedImage(img);
  };

  const cropImageNow = () => {
    if (
      !loadedImage ||
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height
    ) {
      console.log("Image not cropped correctly");
      return;
    }

    const canvas = document.createElement("canvas");
    const scaleX = loadedImage.naturalWidth / loadedImage.width;
    const scaleY = loadedImage.naturalHeight / loadedImage.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      loadedImage,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Converting to base64
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File(
          [blob],
          `${showCoverModal ? "background" : "profile"}.jpeg`,
          {
            type: "image/jpeg",
          }
        );
        if (showCoverModal) {
          setCover(croppedFile);
        } else {
          setDP(croppedFile);
        }
      }
    }, "image/jpeg");
    setIsCroping(false);
  };

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

  /////////// HANDLE FILE UPLOAD //////////////////////////////

  const handleSubmit = async (type: string) => {
    const formData = new FormData();
    setIsCroping(false);

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

  const handleCloseModal = () => {
    setShowCoverMdal(false);
    setShowDpMdal(false);
    setIsCroping(false);
  };

  return (
    <>
      {(showCoverModal || showDpModal) && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-xl border-white">
              <div
                className={`border-0 rounded-lg shadow-lg ${
                  isDarkMode
                    ? "bg-custom-blue/40 backdrop-blur-xl text-white"
                    : "bg-white"
                } relative flex flex-col w-full outline-none focus:outline-none`}
              >
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">Edit</h3>
                  <button
                    className="p-1 ml-auto border-0 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleCloseModal}
                  >
                    X
                  </button>
                </div>

                <div className="relative p-6 flex flex-col justify-center items-center">
                  {showCoverModal && (
                    <div
                      className={`w-full h-60 md:h-full cursor-pointer mt-4 ${
                        isDarkMode ? "bg-black" : "bg-gray-200"
                      } flex items-center p-4 justify-center text-gray-500`}
                      onClick={changeCover}
                    >
                      {cover ? (
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                        >
                          <img
                            className="object-cover w-80 h-80"
                            src={URL.createObjectURL(cover)}
                            alt="Background"
                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                          />
                        </ReactCrop>
                      ) : (
                        <span className="text-sm text-center">
                          Click to upload background image
                        </span>
                      )}
                    </div>
                  )}
                  {showDpModal && (
                    <div
                      className={`w-full h-60 md:h-full cursor-pointer mt-4 ${
                        isDarkMode ? "bg-black" : "bg-gray-200"
                      } p-5 flex items-center justify-center text-gray-500`}
                      onClick={changeDp}
                    >
                      {DP ? (
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                        >
                          <img
                            className="object-cover w-80 h-80"
                            src={URL.createObjectURL(DP)}
                            alt="Profile"
                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                          />
                        </ReactCrop>
                      ) : (
                        <span className="text-sm text-center">
                          Click to upload profile image
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-col items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {DP || cover ? (
                    <button
                      onClick={cropImageNow}
                      className={`${
                        DP || cover
                          ? "bg-custom-blue  w-full mb-2 text-white px-6 py-3 mr-1"
                          : ""
                      }`}
                    >
                      Crop
                    </button>
                  ) : null}

                  <button
                    className={`bg-custom-blue w-full flex justify-center  font-bold text-white uppercase text-sm text-center px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="submit"
                    onClick={() =>
                      handleSubmit(
                        `${showCoverModal ? "background" : "profile"}`
                      )
                    }
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin" size={20} />
                    ) : (
                      "Submit"
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
        disabled={isCroping ? true : false}
        accept="image/*"
        name="background"
        ref={bgRef}
        className="hidden"
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        name="profile"
        disabled={isCroping ? true : false}
        ref={profileRef}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

export default ProfileModal;
