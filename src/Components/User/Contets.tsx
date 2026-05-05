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
      <div
        key={index}
        className={`${isProfile ? "aspect-square w-full overflow-hidden rounded-[20px]" : "aspect-[4/5] w-full overflow-hidden bg-slate-100/40 dark:bg-white/5"}`}
      >
        <img
          src={item.url}
          alt={`Image ${index}`}
          className={`h-full w-full ${isProfile ? "object-cover" : "object-cover"}`}
        />
      </div>
    ) : (
      <div
        key={index}
        className={`${isProfile ? "aspect-square w-full overflow-hidden rounded-[20px]" : "aspect-[4/5] w-full overflow-hidden bg-slate-100/40 dark:bg-white/5"}`}
      >
        <video
          controls
          className="h-full w-full object-cover"
          autoPlay
          src={item.url}
        ></video>
      </div>
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
