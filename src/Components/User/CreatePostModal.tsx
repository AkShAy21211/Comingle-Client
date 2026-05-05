import React, { SetStateAction, useRef, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdOutlinePhotoLibrary, MdOutlineSchedule } from "react-icons/md";
import userApi from "../../Apis/user";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "@ant-design/react-slick";
import { CgSpinner } from "react-icons/cg";
import { connectToSocket } from "../../Apis/socket";
import { Tooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

type CreatePostProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setfetchAgain?: React.Dispatch<SetStateAction<boolean>>;
  isMobile?: boolean;
  fetchAgain?: boolean;
};

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  arrows: false,
  slidesToScroll: 1,
};

type ValuePiece = Date | null;

const CreatePostModal: React.FC<CreatePostProps> = ({ setOpenModal }) => {
  const socket = connectToSocket();
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [posting, setPosting] = useState(false);
  const [schedule, onChange] = useState<ValuePiece>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handleOpenImageInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files);

      selectedImages.forEach((file) => {
        if (file.type.startsWith("video") && !file.type.endsWith("mp4")) {
          toast.error(
            "Unsuported file format (mov) select video(mp4) or image",
            {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
          return;
        } else {
          setImages((prev) => [...prev, ...selectedImages]);
        }
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    const currentDate = new Date();
    if (date && date < currentDate) {
      setDateError("Invalid date");
    } else {
      onChange(date);
      setDateError(null);
    }
  };

  const handleSubmit = async () => {
    if (!images.length && !text) {
      toast.error("Please select a file or type something", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    setPosting(true);

    const formData = new FormData();

    if (images && images.length) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    formData.append("text", text);
    formData.append("type", "post");
    if (schedule) {
      formData.append("schedule", schedule.toString());
    }
    try {
      const newPost = await userApi.createNewPost(formData);

      if (newPost?.data) {
        setOpenModal(false);
        setImages([]);
        setText("");
        setPosting(false);
        socket.emit("newpost");
      }
    } catch (error) {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4 backdrop-blur-md">
      <div
        className={`w-full max-w-[720px] overflow-hidden rounded-t-[28px] border shadow-[0_40px_120px_-35px_rgba(15,23,42,0.55)] sm:rounded-[32px] ${
          isDarkMode
            ? "border-white/10 bg-slate-900/95 text-white"
            : "border-white/70 bg-white/95 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10">
          <div>
            <p className="font-display text-xl font-semibold sm:text-2xl">Create post</p>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Share an update, image, or scheduled post.
            </p>
          </div>
          <IoCloseCircleSharp
            onClick={() => setOpenModal(false)}
            className="cursor-pointer rounded-full text-2xl"
          />
        </div>

        <div className="flex p-4 sm:p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`min-h-32 w-full resize-none rounded-[24px] border p-4 text-base focus:outline-none sm:min-h-36 sm:p-5 sm:text-xl ${
              isDarkMode
                ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                : "border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400"
            }`}
            placeholder="What's worth sharing today?"
          ></textarea>
        </div>

        {images.length > 0 && (
          <div className="w-full px-4 pb-2 sm:px-6">
            <div className="overflow-hidden rounded-[24px]">
              <Slider {...settings}>
                {images.map((file, index) =>
                  file.type.startsWith("image") ? (
                    <div key={index} className="w-full">
                      <div className="aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-slate-100/50 dark:bg-white/5">
                      <img
                        className="h-full w-full object-cover"
                        src={URL.createObjectURL(file)}
                        alt=""
                      />
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="w-full">
                      <div className="aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-slate-100/50 dark:bg-white/5">
                      <video
                        className="h-full w-full object-cover"
                        src={URL.createObjectURL(file)}
                        controls
                        autoPlay
                      />
                      </div>
                    </div>
                  )
                )}
              </Slider>
            </div>
          </div>
        )}

        <div className="relative flex flex-wrap items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={handleOpenImageInput}
          >
            <MdOutlinePhotoLibrary
              size={20}
              className="text-blue-500"
            />
            Add media
          </button>
          <Tooltip id="photoLibraryTooltip" place="top">
            Select Photo/Video
          </Tooltip>
          <input
            type="file"
            multiple
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <MdOutlineSchedule
              data-tooltip-id="scheduleTooltip"
              className="text-custom-blue"
              size={20}
            />
            Schedule
          </button>
          <Tooltip id="scheduleTooltip" place="top">
            Schedule
          </Tooltip>

          {isCalendarOpen && (
            <div className="w-full">
              <DatePicker
                selected={schedule}
                onChange={(date: Date | null) => handleDateChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded-2xl border border-gray-300 p-3 text-sm"
                popperPlacement="bottom"
              />
            </div>
          )}

          {dateError && (
            <p className="text-red-500 text-xs text-nowrap">{dateError}</p>
          )}
        </div>

        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5 dark:border-white/10">
          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {images.length ? `${images.length} file selected` : "Text-only posts are supported too"}
          </p>
          <button
            onClick={handleSubmit}
            type="submit"
            className="inline-flex w-full items-center justify-center gap-x-2 rounded-2xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            {posting ? (
              <CgSpinner size={20} className="animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
