import { Plans, SignInType } from "../Interface/interface";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminEndPoints from "./Endpoints/admin";
import axiosInstance from "./adminAxios";

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

  getPlanDetails: async () => {
    try {
      const planResponse = await axiosInstance.get(
        adminEndPoints.GET_PLAN_DETAILS
      );

      return planResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  createPlan: async (data:any) => {
    try {
      const planResponse = await axiosInstance.post(
        adminEndPoints.CREATE_PLAN,
        {data}
      );

      return planResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  updatePlan: async (data:any) => {
    try {
      const planResponse = await axiosInstance.put(
        adminEndPoints.UPDATE_PLAN,
        {data}
      );

      return planResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

    getUsers: async () => {
    try {
      const userResponse = await axiosInstance.get(
        adminEndPoints.GET_USERS,
      );

      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  },


    blockOrUnblockUser: async (userId:string) => {
    try {
      const userResponse = await axiosInstance.patch(
        adminEndPoints.BLOCK_UNBLOCK_USER+`/${userId}`,
      );

      return userResponse.data;
      
    } catch (error) {
      console.log(error);
    }
  },
};

export default adminApi;
