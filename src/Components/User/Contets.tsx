import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ContentsProps = {
  content: { url: string; type: string }[]; // Assuming each post has an array of image URLs
};

const Contents = ({ content }: ContentsProps) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      {content.length > 1 ? (
        <div className="w-full h-full ">
          <Slider {...settings}>
            {content.map(
              (content: { url: string; type: string }, index: number) =>
                content.type === "image" ? (
                  <img
                    src={content.url}
                    alt={`Image ${index}`}
                    className=" object-cover w-full h-full"
                  />
                ) : (
                    <video
                    controls
                    autoPlay
                    src={content.url}
                  ></video>
                
                )
            )}
          </Slider>
        </div>
      ) : (
        <div className="w-full h-full">
          {content[0].type === "image" ? (
            <img
              src={content[0].url}
              alt={`Image`}
              className=" object-cover w-full h-full"
            />
          ) : (
            <video src={content[0].url} controls autoPlay></video>
          )}
        </div>
      )}
    </>
  );
};

export default Contents;
