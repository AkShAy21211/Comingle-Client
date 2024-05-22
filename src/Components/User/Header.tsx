import  { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMediaQuery } from '@react-hook/media-query';

import LogoutModal from '../Common/LogoutModal';
function Header() {

  const [profileMenue,setProfileMenu] = useState(false);
  const handleProfileToogle = () => setProfileMenu(!profileMenue)
  const [logoutMdal,setLogoutModal] = useState(false);
  const  isSmallScreen = useMediaQuery("(max-width: 768px)");


  return (
  <>
  <nav className="bg-custom-blue top-0 fixed w-full z-50">
  <div className="mx-auto w-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="flex  sm:justify-start">
        <div className="flex flex-shrink-0 items-center">
          <h1 className='text-white font-bold text-xl'>Comingle</h1>
        </div>
        {/* <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">

            <Link to="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</Link>
            <Link to="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Calendar</Link>
          </div>
        </div> */}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button type="button" className="relative rounded-fullp-1 text-gray-400 hover:text-white focus:outline-none  focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5"></span>
          <span className="sr-only">View notifications</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        <div className="relative  ml-3">
          <div>
            <button
      onClick={handleProfileToogle}
      type="button"
      className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      id="user-menu-button"
      aria-expanded="false"
      aria-haspopup="true"
    >
      <span className="absolute -inset-1.5"></span>
      <span className="sr-only">Open user menu</span>
      <img
        className="h-8 w-8 rounded-full"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      {isSmallScreen ? (
        <Link to="/profile" className="absolute inset-0 z-50" />
      ) : null}
    </button>
          </div>

 
         {
          profileMenue && (
             <div className="absolute hidden lg:block  right-0 z-10 mt-2 border w-48  rounded-md bg-white py-1 shadow-lg   ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" >
            <Link to="/profile" onClick={()=>setProfileMenu(false)} className="block  focus:bg-custom-blue focus:text-white  active:bg-custom-blue active:text-white px-4 py-2 text-sm text-gray-700" role="menuitem"  id="user-menu-item-0">Your Profile</Link>
            <Link to="#" onClick={()=>setProfileMenu(false)} className="block  focus:bg-custom-blue focus:text-white   active:bg-custom-blue active:text-white px-4 py-2 text-sm text-gray-700" role="menuitem"id="user-menu-item-1">Settings</Link>
            <Link to="#"  onClick={()=>{setLogoutModal(true);setProfileMenu(false)}} className="block  focus:bg-custom-blue focus:text-white   active:bg-custom-blue active:text-white px-4 py-2 text-sm text-gray-700" role="menuitem"  id="user-menu-item-2">Sign out</Link>
          </div>
          )
         }

        </div>


        
      </div>
    </div>
  </div>
        
</nav>
{
  logoutMdal && <LogoutModal  setLogoutModal={setLogoutModal} />

}  </>
  )
}

export default Header
