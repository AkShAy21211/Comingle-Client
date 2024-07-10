import OtpInput from '../../Components/User/OtpInput'
import LoginLeft from '../../Components/User/LoginLeft'
import userApi from '../../Apis/user';
import { Otp } from '../../Interface/interface';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
function OtpVerify() {


  const navigate = useNavigate();
  const { handleSubmit, values, setFieldValue } = useFormik<Otp>({
    initialValues: {
      otp: "",
    },
    onSubmit: onSubmit,
  });

  async function onSubmit(otpData: Otp) {
    const otpVerifyResponse = await userApi.verifyOtp(otpData);
    if(otpVerifyResponse){
     setTimeout(() => {
       navigate('/login')
     }, 1000);
    }
  }
  return (
   <div className="flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text="Verify Your Account to Get Started" />
      <div className="w-full  flex  flex-col justify-center items-center ">
        <OtpInput verficationType='account' values={values} handleSubmit={handleSubmit} setFieldValue={setFieldValue}/>
      </div>
    </div>
  )
}

export default OtpVerify
