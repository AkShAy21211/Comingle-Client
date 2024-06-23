import { SignInType } from "../Interface/interface";
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

  createPlan: async (data: any) => {
    try {
      const planResponse = await axiosInstance.post(
        adminEndPoints.CREATE_PLAN,
        { data }
      );

      return planResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  updatePlan: async (data: any) => {
    try {
      const planResponse = await axiosInstance.put(adminEndPoints.UPDATE_PLAN, {
        data,
      });

      return planResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  getUsers: async () => {
    try {
      const userResponse = await axiosInstance.get(adminEndPoints.GET_USERS);

      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  blockOrUnblockUser: async (userId: string) => {
    try {
      const userResponse = await axiosInstance.patch(
        adminEndPoints.BLOCK_UNBLOCK_USER + `/${userId}`
      );

      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  },

  getAllPosts: async (page: number) => {
    try {
      const postResponse = await axiosInstance.get(
        adminEndPoints.GET_POSTS + `/${page}`
      );
      return postResponse.data;
    } catch (error) {
      console.log(error);
    }
  },
  hideUnhidePost: async (postId: string) => {
    try {
      const postResponse = await axiosInstance.patch(
        adminEndPoints.HIDE_UNHIDE_POST + `/${postId}`
      );
      if (postResponse.data.status) {
        toast.success(postResponse.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        return;
      }
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
    }
  },

  dismissReports: async (postId: string) => {
    try {
      const response = await axiosInstance.delete(
        adminEndPoints.DISMISS_REPORT+`/${postId}`
      );
      if (response.data.status) {
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        return;
      }
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

      return;
    }
  },

  getPostReactions: async (postId: string) => {
    try {
      console.log('66666666666666666666',postId);
      
      const response = await axiosInstance.get(
        adminEndPoints.GET_POST_REACTIOINS + `/${postId}`
      );

      
      if (response.data) {
       
        return response.data
      }
    } catch (error: any) {
    
      console.log(error);
      
    }
  },

   getAnalytics: async () => {
    try {
      
      const response = await axiosInstance.get(
        adminEndPoints.ANALYTICS
      );

      if (response.data) {
       
        return response.data
      }
    } catch (error: any) {
    
      console.log(error);
      
    }
  },

   getSubscriptions: async () => {
    try {
      
      const response = await axiosInstance.get(
        adminEndPoints.GET_SUBSCRIPTIONS
      );

      if (response.data) {
       
        return response.data
      }
    } catch (error: any) {
    
      console.log(error);
      
    }
  },
};


export default adminApi;
