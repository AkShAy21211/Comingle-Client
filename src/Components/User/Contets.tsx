import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ContentsProps = {
  content: string[]; // Assuming each post has an array of image URLs
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
    {
      content.length>1?<div className="w-full h-full">
      <Slider {...settings}>
        {content.map((image: string, index: number) => (
          <img src={image} alt={`Image ${index}`} className=" object-contain w-full h-full" />
        ))}
      </Slider>
    </div>:<div className="w-full h-full">
   
          <img src={content[0]} alt={`Image`} className=" object-contain w-full h-full" />
     
    </div>
    }
    </>
  );
};

export default Contents;
