import UserAvatar from './UserAvatar'
import PremiumAd from './PremiumAd'
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
function RightPanel() {

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
 <div className={`h-screen  ${isDarkMode?"bg-black text-white":""}  col-start-5 col-end-6 sticky top-0  shadow-lg hidden lg:block overflow-hidden`}>
		<div className="flex-1  p-10 mt-14">
		
    <UserAvatar suggestions='Fridends' isRight/>
    <PremiumAd/>
		</div>
    </div>
  )
}

export default RightPanel
