import UserAvatar from './UserAvatar'
import PremiumAd from './PremiumAd'

function RightPanel() {
  return (
 <div className='h-screen   col-span-1 sticky top-0  shadow-lg hidden lg:block overflow-hidden'>
		<div className="flex-1  p-10 mt-14">
		
    <UserAvatar suggestions='Fridends' isRight/>
    <PremiumAd/>
		</div>
		
		
    </div>
  )
}

export default RightPanel
