import React from "react";


type QuickViewBoxPros={

    title:string;
    count:number;
}
function QuickViewBox({title,count}:QuickViewBoxPros) {
  return (
    <div className={`w-4/5 text-3xl  font-bold sm:w-3/4 md:w-1/2  bg-custom-blue/90 text-white border-custom-teal border-4 backdrop-blur-xl lg:w-1/6 h-52 p-20 shadow-xl  flex flex-col  gap-y-1 justify-center items-center rounded-xl`}>
      {count}
      <h2 className="text-lg text-nowrap text-center font-light">{title}</h2>
    </div>
  );
}

export default QuickViewBox;
