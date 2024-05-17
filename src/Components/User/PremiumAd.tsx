import React from 'react'

function PremiumAd() {
  return (
    <div className='h-auto  overflow-hidden rounded-lg w-full mt-14 p-10 flex flex-col bg-white shadow-xl border '>
      <h2 className='text-center text-custom-blue  lg:text-f-10 xl:text-sm'>Upgrade to premium fo just 499/only</h2>
      <ul className='hidden xl:block text-nowrap lg:text-sm md:text-f-10 list-inside space-y-1 text-gray-500 list-disc  dark:text-gray-400'>
        <li className='mt-3 text-gray-600'>Exclusive content</li>
        <li className=' mt-3 text-gray-600'>Verified Badge</li>
        <li className=' mt-3 text-gray-600'>Networking</li>
      </ul>
      <button className=" bg-custom-gold mt-4 lg:text-f-10 text-center w-auto hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full xl:text-sm">
  Upgrade
</button>
    </div>
  )
}

export default PremiumAd
