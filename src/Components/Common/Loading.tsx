import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userLogin } from "../../Redux/Slice/User/userSlice";
import {User} from "../../Interface/interface";
import userApi from "../../Apis/user";

interface LoadingProps {
  size: number;
}

const Loading: React.FC<LoadingProps> = ({ size }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  localStorage.setItem("token", JSON.stringify(token));
console.log(token);

  //////// fetching user profile ///////////////

  const fetchUserProfile = async () => {
    try {
      const user = await userApi.profile();
      console.log("profile accessed");

      if (token) {
        user.token = token;
        dispatch(userLogin(user))
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="w-full bg bg-custom-blue flex-center h-screen flex justify-center items-center">
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className="animate-spin "
      >
        <div
          className="h-full w-full border-4 border-t-custom-blue
       border-b-custom-blue rounded-[50%]"
        ></div>
      </div>
    </div>
  );
};

export default Loading;
