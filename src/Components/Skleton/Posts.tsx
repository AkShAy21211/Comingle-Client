

const Posts = () => {
  return (
    <>
      {" "}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-min gap-5">
        {
            Array.from([1,2,3,4,4,5]).map((value:number)=>(
                <div key={value} className="w-full h-52 md:h-72 bg-gray-300 animate-pulse rounded-lg mt-5"></div>
            ))
        }
      </div>
    </>
  );
};

export default Posts;
