import { SlLike } from "react-icons/sl";
import { FaRegCommentAlt } from "react-icons/fa";
import { VscSave } from "react-icons/vsc";
import CreatePost from "./CreatePost";

function Posts() {
  return (
    <>
      <div className='h-auto mt-28 flex flex-col items-center justify-start w-full overflow-auto overscroll-y-auto'>
      <CreatePost/>

      <div className=' h-96 shadow-md border border-gray-300 flex flex-col justify-between items-center w-5/6 lg:w-2/6 mb-10'>
        <div className='flex-grow w-full p-4'>
          {/* Your main content goes here */}
          <p>Main content of the first post...</p>
        </div>
        <div className='w-full h-16 flex justify-around items-center p-4 bg-gray-100'>
          <SlLike />
          <FaRegCommentAlt />
          <VscSave />
        </div>
      </div>
 <div className=' h-96 shadow-md border border-gray-300 flex flex-col justify-between items-center w-5/6 lg:w-2/6 mb-10'>
        <div className='flex-grow w-full p-4'>
          {/* Your main content goes here */}
          <p>Main content of the first post...</p>
        </div>
        <div className='w-full h-16 flex justify-around items-center p-4 bg-gray-100'>
          <SlLike />
          <FaRegCommentAlt />
          <VscSave />
        </div>
      </div>

    
    </div>
    </>
  
  )
}

export default Posts;
