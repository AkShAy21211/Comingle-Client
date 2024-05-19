import { SignInType } from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminEndPoints from "./Endpoints/admin";
import axiosInstance from "./axios";

const adminApi = {
  signin: async (adminData: SignInType) => {
    try {
      const signinResponse = await axiosInstance.post(
        adminEndPoints.login,
        adminData
      );

      if (signinResponse.status) {
        toast.success(signinResponse.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    
      return signinResponse;
    } catch (error: any) {
      toast.error(error.response.data.message, {
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
};



export default adminApi;