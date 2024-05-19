import { FaBell } from "react-icons/fa";

function Header() {
  return (
    <div className='h-20 bg-custom-blue z-40 fixed  flex justify-end left-0 right-0 top-0 '>
       <div className="flex">
         <FaBell size={28} className="m-6 -me-0  text-custom-gold" />
        <img className="w-8 h-8 m-5 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="https://img.freepik.com/premium-vector/businessman-flat-icon-man-business-suit-avatar-businessman-flat-internet-icon-rounded-shape-web-mobile-design-element-male-profile-vector-colored-illustration_263753-2878.jpg?size=626&ext=jpg&ga=GA1.1.885222701.1706885504&semt=ais_user" alt="Bordered avatar"/>
       </div>
    </div>
  )
}

export default Header
