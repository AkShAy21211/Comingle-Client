import axiosInstance from "./axios";
import { Otp, SignInType, SignUpType } from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import userEnpoints from "./Endpoints/user";

const currentUser = localStorage.getItem("user");

const user = currentUser ? JSON.parse(currentUser) : null;

let token = localStorage.getItem("token");

token = token ? JSON.parse(token) : null;

const userApi = {
  // User signup and send otp start
  signup: async (formData: SignUpType) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const signupResponse = await axiosInstance.post(
        userEnpoints.SIGNUP,
        JSON.stringify(formData),
        config
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
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const signinResponse = await axiosInstance.post(
        userEnpoints.SIGNIN,
        JSON.stringify(userData),
        config
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
          Authorization: `Bearer ${user?.token || token}`,
        },
      };

      const { data } = await axiosInstance.get(userEnpoints.PROFILE, config);

      console.log("caling user");

      console.log(data);

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

        return response;
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
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      };
      console.log(config);

      const updatedUserInfo = await axiosInstance.patch(
        userEnpoints.PROFILE_UPDATE_INFO,
        JSON.stringify(userData),
        config
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
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(email);

      const forgetPasswprdResponse = await axiosInstance.post(
        userEnpoints.FORGOT_PASSWORD,
        { email: email },
        config
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
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const updatedResponse = await axiosInstance.post(
        userEnpoints.UPDATE_PASSWORD,
        { password: password },
        config
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
};

export default userApi;
