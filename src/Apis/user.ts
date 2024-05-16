import axiosInstance from "./axios";
import { Otp, SignUpType } from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userEnpoints from "./Endpoints/user";

const userApi = {
  // User signup and send otp start
  signup: async (formData: SignUpType) => {
    try {
      const signupResponse = await axiosInstance.post(
        userEnpoints.SIGNUP,
        formData
      );

      toast.success(`OTP sent to ${formData.email}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      return signupResponse;
    } catch (error: any) {
      toast.warning(error.response.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      console.log(error);
    }
  },

  // User signup and send otp end

  verifyOtp: async (otp: Otp) => {
    try {
      console.log(otp);
      
      const OtpVerifyResponse = await axiosInstance.post(userEnpoints.VERIFYOTP, otp);
console.log(OtpVerifyResponse);

      if(OtpVerifyResponse.data.status){
        toast.success(OtpVerifyResponse.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      return OtpVerifyResponse;
      }
    } catch (error:any) {
      console.log(error);
      
        toast.warning(error.response.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      
    }    
  },
};

export default userApi;
