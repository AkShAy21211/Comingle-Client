import axiosInstance from "./axios";
import {
  CurrentUser,
  Otp,
  SignInType,
  SignUpType,
} from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import userEnpoints from "./Endpoints/user";

const userData = localStorage.getItem("user");
const user = userData ? JSON.parse(userData) : null;

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
        autoClose: 3000,
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
        autoClose: 3000,
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

      const OtpVerifyResponse = await axiosInstance.post(
        userEnpoints.VERIFYOTP,
        otp,
        {
          withCredentials: true,
        }
      );

      if (OtpVerifyResponse.data.status) {
        toast.success(OtpVerifyResponse.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        return OtpVerifyResponse;
      }
    } catch (error: any) {
      console.log(error);

      toast.warning(error.response.data.message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  },

  resendOTP: async () => {
    try {
      const resendResponse = await axiosInstance.post(userEnpoints.RESEND_OTP);

      if (resendResponse.data.status) {
        toast.success(resendResponse.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  },

  signin: async (userData: SignInType) => {
    try {
      const signinResponse = await axiosInstance.post(
        userEnpoints.SIGNIN,
        userData
      );

      if (signinResponse.data.status) {
        toast.success(signinResponse.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        
        return signinResponse;
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  },

  profile: async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axiosInstance.get(userEnpoints.PROFILE, config);

      return data.user;
    } catch (error) {}
  },

  updateProfileImage: async (type: string, image: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (type === "background") {
        const response = await axiosInstance.patch(
          userEnpoints.PROFILE_UPDATE_COVER,
          { type: type, image: image },
          config
        );

         if (response.data.status) {
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } else {
          toast.warning(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }

        console.log(response.data.message);
        
        return response
      } else {
        const response = await axiosInstance.patch(
          userEnpoints.PROFILE_UPDATE_DP,
          { type: type, image: image },
          config
        );

        if (response.data.status) {
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } else {
          toast.warning(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
                console.log(response.data.message);

       return response

      }
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
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
