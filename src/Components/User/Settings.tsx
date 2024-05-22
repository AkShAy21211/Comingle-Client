import { Link } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

function Settings() {
  return (
     <div className=' '>
     <h2 className="px-10 font-bold">Settings</h2>
       <ul className="pt-2 space-y-5 text-lg flex-1 mt-3  p-10">
				{/* <li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
					    <span>Profile</span>
					</Link>
				</li>
			 */}
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<CgProfile size={30}/>
						<span>Account & Details</span>
					</Link>
				</li>
				
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<IoSettingsOutline size={30}/>
						<span>Settings</span>
					</Link>
				</li>
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<IoLogOutOutline size={30}/>
						<span>Logout</span>
					</Link>
				</li>
			
			</ul>

    </div>
  )
}

export default Settings
