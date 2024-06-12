import React from 'react'
import QuickViewBox from '../QuickViewBox';
import { da } from 'date-fns/locale/da';


const data = [
  {
    title:'users',
    count:100,
    background:'bg-custom-blue',
    textColor:"text-white"
  },
   {
    title:'Contents',
    count:100,
    background:'bg-white',
    textColor:"text-black"


  },
   {
    title:'Blocked Users',
    count:100,
    background:'bg-custom-blue',
    textColor:"text-white"


  },
   {
    title:'Premium Users',
    count:100,
    background:'bg-white',
    textColor:"text-black"


  }
  
]
function SectionOne() {
  return (
    <div className="flex flex-col lg:flex-row  justify-center items-center lg:items-start  w-full gap-10 space-y-8 lg:space-y-0 lg:pt-32  pt-32 h-auto lg:h-scrautoeen">
       
       {
        data.map(data=>(
          <QuickViewBox textColor={data.textColor} background={data.background} title={data.title} count={data.count} />
        ))
       }
      </div>
  )
}

export default SectionOne
