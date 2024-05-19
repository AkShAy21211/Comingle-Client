import React from 'react'

function CountBox() {
  return (
    <>
    <div className=' -mt-5 lg:-mt-20 flex w-full justify-center p-5 gap-5 h-32'>
      
     <div className='border border-black h-16 p-1 w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        200
        <p>Followers</p>
     </div>
     <div className=' border border-black h-16 p-1 w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        180
        <p>Following</p>
     </div>
     <div className=' border border-black h-16 p-1 w-full lg:w-1/6 rounded-lg flex items-center flex-col'>
        5
        <p>Posts</p>
     </div>


    </div>
    </>
  )
}

export default CountBox
