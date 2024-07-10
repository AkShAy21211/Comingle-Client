import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import UserDetails from '../../Components/User/UserDetails';
function PersonalDetails() {

   const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  return (
    <div className={` h-full mb-32 grid-flow-col  ${isDarkMode?'bg-black text-white lg:border-x':""}  flex-col  col-span-full mt-18 pt-20  lg:col-start-2 lg:col-end-5`}>
     <UserDetails/>
    </div>
  )
}

export default PersonalDetails
