import UserAvatar from './UserAvatar'
import PremiumAd from './PremiumAd'
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { useLocation } from 'react-router-dom';

const benefits = [
    "Verified Badge",
     "Ads free experience",
     "Up to 200 follows per day"
];



function RightPanel() {
  const location = useLocation();

const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
const showPremiumAds = ['/settings/subscription'] 

  return (
 <div className={`h-svh  ${isDarkMode?"bg-black text-white":""}  col-start-5 col-end-6 sticky top-0  shadow-lg hidden lg:block overflow-hidden`}>
		<div className="flex-1  p-10 mt-14">
		
    <UserAvatar suggestions='Fridends' isRight/>
    {!showPremiumAds.includes(location.pathname)&&<PremiumAd title='Upgrade to premium fo just 499/only' benifits={benefits} plan='Premium' isPremiumPage={false}/>}
		</div>
    </div>
  )
}

export default RightPanel
