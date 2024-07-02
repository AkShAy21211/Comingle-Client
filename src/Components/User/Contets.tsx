import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PostsType } from '../../Interface/interface';



type ContentsProps = {
  content: PostsType;
  isProfile?: boolean;
  isOwnProfile?: boolean;
  post?: PostsType;
  imageRef?: React.Ref<HTMLDivElement>;
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Contents: React.FC<ContentsProps> = ({
  content,
  isProfile = false,
}) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };



  const renderContentItem = (item: {url:string,type:string}, index: number) => {
    return item.type === 'image' ? (
      <img
        key={index}
        src={item.url}
        alt={`Image ${index}`}
        className={`object-cover ${isProfile ? 'w-52 h-52' : 'w-full max-h-[90vh] object-fill'}`}
      />
    ) : (
      <video
        key={index}
        controls
        className={`object-cover ${isProfile ? 'w-52 h-52' : 'w-full h-full'}`}
        autoPlay
        src={item.url}
      ></video>
    );
  };

  return (
    <>
      {content.image && content.image.length > 0 ? (
        <div className="w-full h-full ">
          {content.image.length > 1 ? (
            <Slider {...settings}>
              {content.image.map((item:{url:string,type:string}, index) => renderContentItem(item, index))}
            </Slider>
          ) : (
            renderContentItem(content.image[0], 0)
          )}
         
        </div>
      ) : (
        <div className="w-full h-full flex justify-center  items-center border break-words overflow-scroll border-black bg-black text-white font-serif ">
          <p className='w-52 h-52 text-sm text-center  pt-4'>{content.description}</p>
        
        </div>
        
      )}
    </>
  );
};

export default Contents;
