import { SignInType } from "../../Interface/interface";
import { Link, useNavigate } from "react-router-dom";
import signinSchema from "../../Validation/User/LoginSchema";
import userApi from "../../Apis/user";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { userLogin } from "../../Redux/Slice/User/userSlice";
import { ImEyeBlocked } from "react-icons/im";
import { ImEye } from "react-icons/im";
import { useRef, useState } from "react";
import { useFormik } from "formik";

function LoginForm() {

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [togglePassword, setTogglePassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null); // Create a ref for the password input
  

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signinSchema,
    onSubmit: async (values: SignInType) => {
      try {
        const signupResponse = await userApi.signin(values);
        
        if (signupResponse?.status) {
          dispatch(userLogin(signupResponse.data.userData));
            formik.resetForm();
            navigate("/");
      
        }
        console.log(signupResponse);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const togglePasswordVisibility = () => {
    if (passwordRef && passwordRef.current) {
      setTogglePassword(!togglePassword);
      const inputType = passwordRef.current?.type === "password" ? "text" : "password";
      passwordRef.current.type = inputType;
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <div className="space-y-2 md:space-y-2 w-full flex flex-col items-center">
        <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
          <strong className="text-white sm:text-white lg:text-gray-500">SIGN</strong>
          <strong className="text-black lg:text-blue-800"> IN</strong>
        </h1>
        <form
          className="space-y-2 md:space-y-4 w-full p-5 sm:w-full md:w-96"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900">
              Your email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
            />
            <p className="text-red-500 text-sm mt-2">{formik.errors.email}</p>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900 ">
              Password
            </label>
            <div className="relative flex">
              <input
                type="password"
                id="password"
                autoComplete="true"
                {...formik.getFieldProps('password')}
                ref={passwordRef}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {!togglePassword ? (
                <ImEyeBlocked
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <ImEye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <p className="text-red-500 text-sm mt-2">{formik.errors.password}</p>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-black lg:bg-blue-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
          >
            Signin
          </button>
          <p className="text-sm pt-0 font-light text-center text-white lg:text-black ">
            <Link
              to="/forgot-password"
              className="font-medium lg:text-blue-800 text-primary-600 hover:underline dark:text-primary-500"
            >
              forget password?{" "}
            </Link>
          </p>
          <p className="text-sm pt-2 font-light text-center text-white lg:text-black ">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium lg:text-blue-800 text-primary-600 hover:underline dark:text-primary-500"
            >
              Signup here
            </Link>
          </p>
        </form>
      </div>
      <div className="flex justify-center items-center mb-4 text-white lg:text-black">
        <hr className="flex-1 border-1 lg:border-black h-0" />
        <p className="px-3 text-sm">or</p>
        <hr className="flex-1 border-1 w-32 lg:border-black h-0" />
      </div>
      <button type="button" onClick={userApi.googleLogin}>
        <FcGoogle size={30} />
      </button>
    </div>
  );
}

export default LoginForm;
