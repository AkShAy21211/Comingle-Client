import React from 'react'
import UserAvatar from './UserAvatar'
import PremiumAd from './PremiumAd'

function RightPanel() {
  return (
    <div className='h-screen  fixed right-0 w-1/5  shadow-lg hidden lg:block overflow-hidden'>
    {/* side bar left options start */}
		<div className="flex-1  p-10 mt-14">
      <UserAvatar isRight suggestions='Friends'/>
      <PremiumAd/>
    </div>
    </div>
  )
}

export default RightPanel
