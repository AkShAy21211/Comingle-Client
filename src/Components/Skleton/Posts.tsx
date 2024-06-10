import React from "react";
import { array } from "yup";

const Posts = () => {
  return (
    <>
      {" "}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-min gap-5">
        {
            Array.from([0,0,0,0,0,0]).map(()=>(
                <div className="w-full h-52 md:h-72 bg-gray-300 animate-pulse rounded-lg mt-5"></div>
            ))
        }
      </div>
    </>
  );
};

export default Posts;
