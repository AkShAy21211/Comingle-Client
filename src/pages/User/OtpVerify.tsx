import React from 'react'
import OtpInput from '../../Components/User/OtpInput'
import LoginLeft from '../../Components/User/LoginLeft'
function OtpVerify() {
  return (
   <div className="flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text="Verify Your Account to Get Started" />
      <div className="w-full  flex  flex-col justify-center items-center ">
        <OtpInput/>
      </div>
    </div>
  )
}

export default OtpVerify
