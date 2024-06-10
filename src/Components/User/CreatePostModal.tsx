import React, { useRef, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import userApi from "../../Apis/user";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "@ant-design/react-slick";
import { useSelector } from "react-redux";
import { RootState } from '../../Redux/store';

type CreatePostProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPost?(): Promise<void>;
};
var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  arrows:false,
  slidesToScroll: 1,
};
const CreatePostModal: React.FC<CreatePostProps> = ({
  setOpenModal,
  fetchPost,
}) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [posting,setPosting] = useState(false);
  const isDarkMode = useSelector((state:RootState) => state.ui.isDarkMode);

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
        setPosting(true);
    
        
        const newPost = await userApi.createNewPost(formData);

        console.log(newPost);
        
        if (newPost?.data.status) {
          setOpenModal(false);
          setImages([]);
          setText("");
          fetchPost && fetchPost();
          setPosting(false)
        }
      
    } catch (error) {
      setPosting(false)
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className={` fixed top-0 left-0 w-full h-full flex items-center justify-center z-[80]`}>
      <div className={`rounded-xl shadow-2xl ${isDarkMode?'bg-neutral-950':"bg-gray-200"} w-80 md:w-1/4 h-auto`}>
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
            className={`w-full ${isDarkMode?'bg-neutral-950 text-white':"bg-gray-200 text-black"}  p-5 bg-gray-200 resize-none text-xlfocus:outline-none h-auto rounded-lg focus:outline-none`}
            placeholder="Type something"
          ></textarea>
        </div>

        <div className="w-full p-4">
            <Slider {...settings}>
             {
              images.length>0&& images.map(image=>(
                <div className="w-full h-full">
               <img className="object-cover h-52 w-full md:w-96 md:h-96 " src={URL.createObjectURL(image)} alt="" />
              </div>
              )) 
             }
            </Slider>
         
        </div>

        <div className="flex px-7 gap-5">
          <MdOutlinePhotoLibrary
            onClick={handleOpenImageInput}
            size={25}
            color="blue"
            className="cursor-pointer"
          />
          <input
            type="file"
            multiple
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="flex justify-end items-center gap-x-2 py-3 px-4">
          <button
            onClick={handleSubmit}
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {posting?'Posting...':"Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
