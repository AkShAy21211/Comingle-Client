import React from 'react'

function SectionOne() {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start  w-full gap-10 space-y-8 lg:space-y-0 lg:pt-32  pt-32 h-auto lg:h-scrautoeen">
        <div className="w-4/5 text-3xl  font-bold sm:w-3/4 md:w-1/2 lg:w-1/6 h-1/5 p-20 shadow-xl bg-custom-blue flex flex-col text-white gap-y-1 justify-center items-center rounded-xl">
          100
          <h2 className="text-xl font-light">Users</h2>
        </div>
        <div className="w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/6 h-1/5 p-20 font-bold text-3xl bg-white shadow-xl border  border-gray-300 flex flex-col  justify-center items-center rounded-xl">
          100
        <h2 className="text-xl font-light">Contents</h2>
        </div>
        <div className="w-4/5 text-3xl  font-bold sm:w-3/4 md:w-1/2 lg:w-1/6 h-1/5 p-20 shadow-xl bg-custom-blue flex flex-col text-white gap-y-1 justify-center items-center rounded-xl">
          100
          <h2 className="text-xl font-light text-center text-nowrap">Blocked Users</h2>
        </div>
        <div className="w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/6 h-1/5 p-20 font-bold text-3xl bg-white shadow-xl border  border-gray-300 flex flex-col  justify-center items-center rounded-xl">
          100
        <h2 className="text-xl font-light text-center text-nowrap">Premium Users</h2>
        </div>
      </div>
  )
}

export default SectionOne
