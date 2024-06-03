import axiosInstance from "./axios";
import { Otp, SignInType, SignUpType } from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import userEnpoints from "./Endpoints/user";
import { log } from "console";

const userApi = {
  signup: async (formData: SignUpType) => {
    try {
      const signupResponse = await axiosInstance.post(
        userEnpoints.SIGNUP,
        JSON.stringify(formData)
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
      const OtpVerifyResponse = await axiosInstance.post(
        userEnpoints.VERIFYOTP,
        otp
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
        JSON.stringify(userData)
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
      console.log("calling suer");

      const { data } = await axiosInstance.get(userEnpoints.PROFILE);

      console.log("userdata", data);

      return data.user;
    } catch (error) {
      console.log(error);
    }
  },

  updateProfileImage: async (type: string, formData: FormData) => {
    try {
      if (type === "background") {
        const response = await axiosInstance.patch(
          userEnpoints.PROFILE_UPDATE_COVER,
          formData
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

        return response;
      } else {
        const response = await axiosInstance.patch(
          userEnpoints.PROFILE_UPDATE_DP,
          formData
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

        return response;
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

  updateUserInfo: async (userData: any) => {
    try {
      const updatedUserInfo = await axiosInstance.patch(
        userEnpoints.PROFILE_UPDATE_INFO,
        JSON.stringify(userData)
      );

      if (updatedUserInfo.status) {
        toast.success(updatedUserInfo.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        return updatedUserInfo;
      } else {
        toast.warning(updatedUserInfo.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      return updatedUserInfo;
    } catch (error: any) {
      toast.error(error.respponse, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      return;
    }
  },

  googleLogin: async () => {
    try {
      window.location.href = "http://localhost:5000/user/auth/google";
    } catch (error) {}
  },

  forgotPassword: async (email: string) => {
    try {
      console.log(email);

      const forgetPasswprdResponse = await axiosInstance.post(
        userEnpoints.FORGOT_PASSWORD,
        { email: email }
      );

      if (forgetPasswprdResponse.status) {
        toast.success(forgetPasswprdResponse.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return forgetPasswprdResponse;
      }
    } catch (error: any) {
      console.log(error);

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
  },

  updatePassword: async (password: string) => {
    try {
      const updatedResponse = await axiosInstance.post(
        userEnpoints.UPDATE_PASSWORD,
        { password: password }
      );

      if (updatedResponse.status) {
        toast.success(updatedResponse.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        return updatedResponse;
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error.response.data.message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      return;
    }
  },
  getAllUsers: async () => {
    try {
      const usersReponse = await axiosInstance.get(userEnpoints.GET_ALL_USERS);

      if (usersReponse.status) {
        return usersReponse.data;
      }
      return usersReponse.data;
    } catch (error) {
      console.log(error);
    }
  },
  followRequest: async (id: string) => {
    try {
      const followRequest = await axiosInstance.post(
        userEnpoints.FOLLOW_REQUEST,
        { recipientId: id }
      );

      if (followRequest.status) {
        toast.success("Follow request sent", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      return followRequest.data;
    } catch (error) {
      console.log(error);
    }
  },

  notifications:async()=>{

    try {
      console.log('called noti');
      
      const notificationsResponse = await axiosInstance.get(userEnpoints.NOTIFICATIONS);       
      return notificationsResponse.data;
    } catch (error) {
      
    }
  },
  getFollowStatus: async (requesterId:String,recipitentId :string) => {
    try {
      const status = await axiosInstance.get(userEnpoints.FOLLOW_STATUS+`/${requesterId}/${recipitentId}`);
      return status;
    } catch (error) {
      console.log(error);
    }
  },

  acceptFollow: async(followId:string)=>{

    try {
      
      const followStatus = await axiosInstance.post(userEnpoints.ACCEPT_FOLLOW+`/${followId}`);

      if(followStatus.status){

        toast.success("Follow request accepted", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }); 
        return followStatus;
      }
      
    } catch (error) {

      console.log(error);
      
    }
  }
};

export default userApi;
