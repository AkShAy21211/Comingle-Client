import React from 'react'

function CountBox() {
  return (
    <>
    <div className=' -mt-5 lg:-mt-14 flex w-full justify-center p-5 gap-5 h-32'>
      
     <div className='border bg-custom-blue text-white  border-black h-16 p-2 w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        200
        <p>Followers</p>
     </div>
     <div className=' border  bg-custom-blue text-white   p-2 border-black h-16  w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        180
        <p>Following</p>
     </div>
     <div className=' border  bg-custom-blue text-white p-2 border-black h-16 w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        5
        <p>Posts</p>
     </div>


    </div>
    </>
  )
}

export default CountBox
