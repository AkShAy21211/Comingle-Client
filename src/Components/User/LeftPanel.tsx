import { PiSquaresFour } from "react-icons/pi";
import { BsChatLeftText } from "react-icons/bs";
import { BsPersonAdd } from "react-icons/bs";
import { CiSaveDown2 } from "react-icons/ci";
import { Link } from "react-router-dom";
import Suggestions from "./Suggestions";

function LeftPanel() {
  return (
    <div className='h-screen  fixed left-0 w-1/5  shadow-lg hidden lg:block overflow-hidden'>
    {/* side bar left options start */}
		<div className="flex-1  p-10 mt-14">
			<ul className="pt-2 space-y-5 text-lg">
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<PiSquaresFour size={30}/>
					    <span>Feeds</span>
					</Link>
				</li>
			
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<BsChatLeftText size={22}/>
						<span>Chat</span>
					</Link>
				</li>
				
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<BsPersonAdd size={30}/>
						<span>Request</span>
					</Link>
				</li>
				<li className="rounded-sm">
					<Link rel="noopener noreferrer" to="#" className="flex items-center p-2 space-x-3 rounded-md">
						<CiSaveDown2 size={30}/>
						<span>Saved</span>
					</Link>
				</li>
			
			</ul>
		</div>
		{/*  */}
		<Suggestions/>
    </div>
  )
}

export default LeftPanel