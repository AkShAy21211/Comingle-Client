import React from 'react'

function PostGrid() {
  return (
    <div className=" h-auto overflow-auto overscroll-y-auto grid grid-cols-2 md:grid-cols-3 p-5 gap-1">
      {/* Your grid items here */}
      <div>
        <img className=' w-52 h-52 aspect-square' src="https://images.unsplash.com/photo-1631631480669-535cc43f2327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww" alt="" />
      </div>
      <div>
        <img className=' w-52 h-52 aspect-square' src="https://images.unsplash.com/photo-1631631480669-535cc43f2327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww" alt="" />
      </div>
      <div>
        <img className=' w-52 h-52 aspect-square' src="https://images.unsplash.com/photo-1631631480669-535cc43f2327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww" alt="" />
      </div>
      
     
    </div>
  )
}

export default PostGrid
