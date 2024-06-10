import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
function PremiumAd() {
      const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className={`h-auto  overflow-hidden rounded-lg ${isDarkMode?'bg-blue-950/75':'bg-white'} w-full mt-14 p-10 flex flex-col shadow-xl border `}>
      <h2 className={`text-center  text-custom-blue ${isDarkMode?'text-blue-400':''}  lg:text-f-10 xl:text-sm`}>Upgrade to premium fo just 499/only</h2>
      <ul className={`hidden xl:block text-nowrap lg:text-sm md:text-f-10 list-inside space-y-1  list-disc ${isDarkMode?'text-white':'text-gray-500'} `}>
        <li className='mt-3 '>Exclusive content</li>
        <li className=' mt-3 '>Verified Badge</li>
        <li className=' mt-3 '>Ads free experience</li>
      </ul>
      <button className={` ${isDarkMode?'bg-custom-gold  text-black':' bg-custom-gold hover:bg-yellow-400'} mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full  font-bold py-2 md:px-0 px-4 rounded-full xl:text-sm`}>
  Upgrade
</button>
    </div>
  )
}

export default PremiumAd
