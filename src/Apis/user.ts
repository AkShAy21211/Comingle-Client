import axiosInstance from './axios';
import { SignUpType } from '../Interface/interface';
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const userApi = {


    signup: async(formData:SignUpType)=>{

        try {
            const signupResponse = await axiosInstance.post("/user/signup",formData);

            toast.success(`OTP sent to ${formData.email}`,{
                position:"bottom-center",
                autoClose:5000,
                hideProgressBar:true,
                closeOnClick:true,
                progress:undefined,
                theme:"colored",
                transition:Bounce,
            })

        } catch (error:any) {
            toast.warning(error.response.data.message,{
                position:"bottom-center",
                autoClose:5000,
                hideProgressBar:true,
                closeOnClick:true,
                progress:undefined,
                theme:"colored",
                transition:Bounce,
            })
            console.log(error);
            
        }


    }
}

export default userApi;