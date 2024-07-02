import  { Dispatch, SetStateAction } from "react";
import { PostsType } from "../../Interface/interface";
import Slider from "react-slick";

type ViewPostsModalProps = {
  selectedPost: PostsType;
  setSelectedPost: Dispatch<SetStateAction<PostsType | null>>;
};
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};
function ViewPost({
  selectedPost,
  setSelectedPost,
}: ViewPostsModalProps) {



  return (
    <>
      <div
        id="modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full "
      >
        <div className="relative p-4 w-full max-w-md  ">
          {/* Modal content */}
          <div className="relative   rounded-lg  bg-gray-200 shadow-xl border mt-20 h-auto pb-8">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5  rounded-t dark:border-gray-600">
              <button
                onClick={() => setSelectedPost(null)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <div className="p-4 md:p-5">
                {selectedPost?.image.length > 1 ? (
                  <div className="w-full h-full">
                    <Slider {...settings}>
                      {selectedPost?.image.map((content, index) => (
                        <div key={index}>
                          {content.type === "image" ? (
                            <>
                              <img
                                src={content.url}
                                alt={`Image ${index}`}
                                className="object-cover w-full h-full"
                              />
                            </>
                          ) : (
                            <>
                              <video
                                controls
                                autoPlay
                                src={content.url}
                              ></video>
                            </>
                          )}
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {selectedPost?.image[0].type === "image" ? (
                      <>
                        <img
                          src={selectedPost?.image[0].url}
                          alt="Image"
                          className="object-cover w-full h-full"
                        />
                      </>
                    ) : (
                      <>
                        <video
                          src={selectedPost?.image[0].url}
                          controls
                          autoPlay
                        ></video>
                      </>
                    )}
                  </div>
                )}
              </div>
              
            </div>
            
          </div>
        </div>
      </div>

     
    </>
  );
}

export default ViewPost;
