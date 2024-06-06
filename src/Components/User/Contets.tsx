import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const Contents = ({ images,url }:any) => {
  
  
    const settings = {

    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:false

  };
  
  
    return (
      <>
      <Slider {...settings} >
         {images.map((image:any) => (

          <img
            src={image.url||url}
            className=" aspect-[4/4] h-auto object-cover rounded "
          />
      ))}
      </Slider>
     
      </>
   
  );
};

export default Contents;
