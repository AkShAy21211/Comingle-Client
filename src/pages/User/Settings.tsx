import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutModal from "../../Components/Common/LogoutModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { toggleMode } from "../../Redux/Slice/Theam/theamSlice";

function Settings() {
  const [logoutModal, setLogoutModal] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  console.log(isDarkMode);

  const dispatch = useDispatch();
  return (
    <div className={` h-screen  flex ${isDarkMode?'bg-black text-white lg:border-x':""}  flex-col overflow-hidden col-span-full mt-18 pt-20  lg:col-start-2 lg:col-end-5`}>
      <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        Personal Details
      </h1>
      <ul className="h-auto   w-full  text-nowrap space-y-5  pl-10 lg:pl-0 text-md">
      
        <li className="lg:text-center flex lg:block">
             <Link to="/details">Edit personal details</Link> 
           
        </li>
      </ul >
      
      
      <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        Account seetings
      </h1>
      <ul className="h-auto  w-full  text-nowrap space-y-5  pl-10 lg:pl-0 text-md">
        <li className="lg:text-center">Change password</li>
      </ul>
 <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
       Subscription
      </h1>
      <ul className="h-auto     text-nowrap space-y-5  pl-10 lg:pl-0 text-md">
        <li className="lg:text-center text-custom-gold font-bold">
          <Link to={''}>Upgrade to premium</Link>
        </li>
      </ul>

      <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        App seetings
      </h1>
      <ul className="h-auto   w-full  text-nowrap space-y-5  pl-10 lg:pl-0 text-md">
      
        <li className="lg:text-center flex lg:block">
             <p>Theam</p>   
            <label className="inline-flex mx-3 items-center cursor-pointer">
           
            <input type="checkbox" checked={isDarkMode} onChange={()=>dispatch(toggleMode())} className="sr-only peer " />
            <div className="relative w-11   h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </li>
      </ul >
      <Link
        to=""
        onClick={() => setLogoutModal(true)}
        className="text-red-500 lg:text-center p-5  font-bold text-xl mt-5 w-auto"
      >
        Logout
      </Link>

      {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
    </div>
  );
}

export default Settings;
