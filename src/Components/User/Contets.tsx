import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const Contents = ({ images }:any) => {
  console.log(images);
  
  
    const settings = {

    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  
    return (
      <>
      <Slider {...settings}>
         {images.map((image:any) => (
        <div key={image.id} className="w-full">
          <img
            src={image.url}
            className=" aspect-[4/4] h-auto object-cover rounded "
          />
        </div>
      ))}
      </Slider>
     
      </>
   
  );
};

export default Contents;
