import React, { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import SimpleImageSlider from "react-simple-image-slider";
import userApi from "../../Apis/user";

type CreatePostProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreatePostModal({ setOpenModal }: CreatePostProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const handleOpenImageInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (images.length > 0) {
        images.forEach((image) => {
          formData.append(`images`, image);
        });
        formData.append("text", text);
        formData.append("type", "post");
      }

      const newPost = await userApi.createNewPost(formData);

      if(newPost?.data.status){

        setOpenModal(false);
        setImages([]);
        setText('')
      }
      
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[80]">
        <div className="rounded-xl shadow-2xl bg-gray-200 w-auto">
          <div className="flex justify-end items-center py-3 px-4 dark:border-neutral-700">
            <IoMdClose
              onClick={() => setOpenModal(false)}
              className="rounded-full bg-black text-white cursor-pointer"
            />
          </div>

          <div className="p-4 overflow-y-auto flex">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-96 p-5 bg-gray-200 resize-none text-xl text-gray-900 focus:outline-none h-auto rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type something"
            ></textarea>
          </div>

          <div className="w-full p-4">
            {images && images.length > 0 && (
              <SimpleImageSlider
                width={400}
                height={300}
                images={images.map((image) => URL.createObjectURL(image))}
                showBullets={true}
                showNavs={true}
              />
            )}
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
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePostModal;
