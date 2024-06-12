import React from 'react'
import QuickViewBox from '../QuickViewBox'
import PlanBenifitBox from './PlanBenifitBox'




const  benifits =[
    'Verified Badge',
    'Ads free experience',
    'Up to 200 follows per day'
  ]
  


function SectionOne() {
  return (
   <>
    <div className="flex flex-col justify-center items-center lg:flex-row lg:justify-center   w-full gap-10 space-y-8 lg:space-y-0 lg:pt-32  pt-32 h-auto lg:h-scrautoeen">
      <QuickViewBox textColor='text-white' background='bg-custom-blue' title='Total amount' count={30000}/>
      <PlanBenifitBox  plan='Premium' title='Premium Plan Details'/>
      <PlanBenifitBox plan='Default' title='Default Plan Details'/>
    </div>

    <div className=" mt-20  rounded-xl overflow-x-auto shadow-lg  mx-14 overflow-auto">
    <table className="w-full text-sm text-left rtl:text-right   ">
        {/* <thead className="text-xs  uppercase bg-gray-50 dark:bg-gray-300 dark:text-gray-400">
            <tr>
                <th scope="col" className="p-4">
                    <div className="flex items-center">
                        <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label  className="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Color
                </th>
                <th scope="col" className="px-6 py-3">
                    Category
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead> */}
        <tbody>
            <tr className="   rounded-xl shadow-xl border-2">
                <td className="w-4 p-4">
                    {/* <div className="flex items-center">
                        <input id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label className="sr-only">checkbox</label>
                    </div> */}
                </td>
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                    Akshay P
                </th>
               
                <td className="px-6 py-4 flex justify-center w-32 ">
                   <span className='bg-custom-gold p-1 rounded-xl px-5 text-white'> Premium</span>
                </td>
                 <td className="px-6 py-4">
                    $2999
                </td>
            </tr>

        </tbody>
    </table>
</div>
   </>
  )
}

export default SectionOne
