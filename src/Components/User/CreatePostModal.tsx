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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Add date picker CSS for better styling

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

const CreatePostModal: React.FC<CreatePostProps> = ({
  setOpenModal,
  fetchAgain,
  isMobile,
  setfetchAgain,
}) => {
  const socket = connectToSocket();
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [posting, setPosting] = useState(false);
  const [schedule, onChange] = useState<ValuePiece>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleOpenImageInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files);
      setImages([...images, ...selectedImages]);
    }
  };

  const handleDateChange = (date: Date | null) => {
    const currentDate = new Date();
    if (date && date < currentDate) {
      setDateError("Invalid date");
    } else {
      onChange(date);
      setDateError(null); // Clear any previous error
    }
  };

  
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      formData.append("text", text);
      formData.append("type", "post");
      if(schedule){
        formData.append("schedule",schedule.toString())
      }
      setPosting(true);

      const newPost = await userApi.createNewPost(formData);

      if (newPost?.data.status) {
        setOpenModal(false);
        setImages([]);
        setText("");
        setPosting(false);
        setfetchAgain?.(!fetchAgain);
        if (isMobile) {
          socket.emit("newpost");
        }
      }
    } catch (error) {
      setPosting(false);
    }
  };



  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[80]">
      <div className="rounded-xl shadow-2xl backdrop-blur-xl w-full max-w-[400px] bg-white">
        <div className="flex justify-end items-center py-3 px-4 dark:border-neutral-700">
          <IoCloseCircleSharp
            onClick={() => setOpenModal(false)}
            className="rounded-full cursor-pointer"
          />
        </div>

        <div className="p-4 overflow-y-auto flex">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-20 p-5 bg-transparent resize-none text-xl focus:outline-none rounded-lg"
            placeholder="Type something"
          ></textarea>
        </div>

        <div className="w-full p-4">
          <Slider {...settings}>
            {images.length > 0 &&
              images.map((file, index) =>
                file.type.startsWith("image") ? (
                  <div key={index} className="w-full h-auto">
                    <img
                      className="object-cover h-60 w-full md:w-full md:h-72"
                      src={URL.createObjectURL(file)}
                      alt=""
                    />
                  </div>
                ) : (
                  <div key={index} className="w-full h-auto">
                    <video
                      className="object-cover h-60 w-full md:w-full md:h-72"
                      src={URL.createObjectURL(file)}
                      controls
                    />
                  </div>
                )
              )}
          </Slider>
        </div>

        <div className="relative flex px-7 gap-5 items-center">
          <div>
            <MdOutlinePhotoLibrary
              onClick={handleOpenImageInput}
              size={25}
              className="cursor-pointer text-blue-500"
            />
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
          </div>

          <div>
            <MdOutlineSchedule
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              data-tooltip-id="scheduleTooltip"
              className="text-custom-blue cursor-pointer"
              size={25}
            />
            <Tooltip id="scheduleTooltip" place="top">
              Schedule
            </Tooltip>
          </div>

          {isCalendarOpen && (
            <DatePicker
              selected={schedule}
              onChange={(date: Date | null) => handleDateChange(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="rounded-lg border border-gray-300 p-2 text-sm w-full"
              popperPlacement="bottom"
            />
          )}

          {dateError && <p className="text-red-500 text-xs text-nowrap">{dateError}</p>}
        </div>

        <div className="flex justify-end items-center gap-x-2 py-3 px-4">
          <button
            onClick={handleSubmit}
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700"
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
