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
          dispatch(
            userLogin({
              user: signupResponse.data.userData,
              token: signupResponse.data.userData.token,
            })
          );

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
      const inputType =
        passwordRef.current?.type === "password" ? "text" : "password";
      passwordRef.current.type = inputType;
    }
  };

  const handleLoginGuest = async () => {
    try {
      const response = await userApi.guestLogin();
      if (response) {
        dispatch(
          userLogin({
            user: response.data.userData,
            token: response.data.userData.token,
          })
        );
        formik.resetForm();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col justify-center items-center py-6">
      <div className="app-surface-strong space-y-4 md:space-y-6 w-full flex flex-col items-center p-6 sm:p-8 rounded-[2rem]">
        <h1 className="text-3xl text-center font-display font-bold leading-tight tracking-tight">
          <span className="text-slate-800">Welcome </span>
          <span className="text-custom-blue bg-clip-text text-transparent bg-gradient-to-r from-custom-blue to-custom-teal">Back</span>
        </h1>
        <form
          className="space-y-5 w-full sm:w-full md:w-[22rem]"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="app-input"
              placeholder="name@example.com"
            />
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">{formik.errors.email}</p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative flex">
              <input
                type="password"
                id="password"
                autoComplete="true"
                {...formik.getFieldProps("password")}
                ref={passwordRef}
                placeholder="••••••••"
                className="app-input pr-10"
              />
              {!togglePassword ? (
                <ImEyeBlocked
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  onClick={togglePasswordVisibility}
                  size={18}
                />
              ) : (
                <ImEye
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-custom-blue cursor-pointer"
                  onClick={togglePasswordVisibility}
                  size={18}
                />
              )}
            </div>
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">
              {formik.errors.password}
            </p>
          </div>
          <button
            type="submit"
            className="app-button-primary w-full text-sm"
          >
            Sign In
          </button>

          <div className="flex flex-col gap-2 pt-2 text-sm font-medium text-center text-slate-600">
            <Link
              to="/forgot-password"
              className="text-custom-teal hover:text-custom-blue hover:underline transition-colors"
            >
              Forgot password?
            </Link>
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-custom-blue font-semibold hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
        
        <button
          onClick={handleLoginGuest}
          type="button"
          className="app-button-secondary w-full sm:w-full md:w-[22rem] mt-2 text-sm"
        >
          Continue as Guest
        </button>
      </div>
      <div className="flex w-full sm:w-full md:w-[22rem] justify-center items-center my-6 text-slate-400 font-medium">
        <hr className="flex-1 border-slate-200" />
        <span className="px-4 text-sm bg-transparent">or continue with</span>
        <hr className="flex-1 border-slate-200" />
      </div>
      <button 
        type="button" 
        onClick={userApi.googleLogin}
        className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-soft border border-slate-100 hover:scale-110 hover:shadow-glass transition-all duration-300"
      >
        <FcGoogle size={28} />
      </button>
    </div>
  );
}

export default LoginForm;
