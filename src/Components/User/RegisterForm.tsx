import { Link } from "react-router-dom";
import { signUpScheema } from "../../Validation/User/RegisterSchema";
import { useFormik } from "formik";
import { SignUpType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { GiConfirmed } from "react-icons/gi";

import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { ImEye, ImEyeBlocked } from "react-icons/im";
function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [validUsername, setValidUsername] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null); // Create a ref for the password input
  const confirmpasswordRef = useRef<HTMLInputElement>(null); // Create a ref for the password input
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePasswordTwo, setTogglePasswordTwo] = useState(false);

  const navigate = useNavigate();
  const {
    errors,
    handleBlur,
    handleChange,
    values,
    handleSubmit,
    handleReset,
  } = useFormik<SignUpType>({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: signUpScheema,
    onSubmit: onSubmit,
  });

  const togglePasswordVisibility = () => {
    if (passwordRef && passwordRef.current) {
      setTogglePassword(!togglePassword);
      const inputType =
        passwordRef.current?.type === "password" ? "text" : "password";
      passwordRef.current.type = inputType;
    }
  };

  const togglePasswordVisibilityTwo = () => {
    if (confirmpasswordRef && confirmpasswordRef.current) {
      setTogglePasswordTwo(!togglePasswordTwo);
      const inputType =
        confirmpasswordRef.current?.type === "password" ? "text" : "password";
      confirmpasswordRef.current.type = inputType;
    }
  };

  /////////////// DEBOUNCING FOR USERNAME ///////////////////////////////////

  const checkUsername = useCallback(
    _.debounce(async (usernamae: string) => {
      if (usernamae.length < 3) return;

      try {
        setLoading(true);
        setUsernameError(null);
        const response = await userApi.checkUsername(usernamae.toLowerCase());

        if (!response.status) {
          setUsernameError(response.message);
          setValidUsername(false);
        } else {
          setValidUsername(true);
        }
        setLoading(false);
      } catch (err) {
        setValidUsername(false);

        setUsernameError("");
      }
    }, 800),
    []
  );

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    checkUsername(value);
  };

  async function onSubmit(formData: SignUpType) {
    if (!validUsername) {
      toast.warn("Please choose a diffrent username", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      return;
    }
    formData.username = "@"+formData.username;
    try {
      const response = await userApi.signup(formData);

      if (response?.data.status) {
        setTimeout(() => {
          navigate("/verify-otp");
          handleReset("");
        }, 1000);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col justify-center items-center py-6">
      <div className="app-surface-strong space-y-4 md:space-y-6 w-full flex flex-col items-center p-6 sm:p-8 rounded-[2rem]">
        <h1 className="text-3xl text-center font-display font-bold leading-tight tracking-tight">
          <span className="text-slate-800">Create </span>
          <span className="text-custom-blue bg-clip-text text-transparent bg-gradient-to-r from-custom-blue to-custom-teal">Account</span>
        </h1>
        <form
          className="space-y-4 w-full sm:w-full md:w-[24rem]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>
            <input
              type="text"
              onChange={handleChange}
              id="name"
              value={values.name}
              onBlur={handleBlur}
              className="app-input"
              placeholder="John Doe"
            />
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">{errors.name}</p>
          </div>
          <div className="w-full relative">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                onChange={(e) => {
                  handleChange(e);
                  handleUsernameChange(e);
                }}
                id="username"
                value={values.username}
                onBlur={handleBlur}
                className="app-input"
                placeholder="unique_username"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                {loading && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin fill-custom-blue"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
                {validUsername && <GiConfirmed size={20} color="#007F86" />}
              </div>
            </div>
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">
              {errors.username || usernameError}
            </p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              onBlur={handleBlur}
              id="email"
              onChange={handleChange}
              value={values.email}
              className="app-input"
              placeholder="name@example.com"
            />
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">{errors.email}</p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="flex relative">
              <input
                onChange={handleChange}
                type="password"
                ref={passwordRef}
                autoComplete="true"
                id="password"
                onBlur={handleBlur}
                value={values.password}
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
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">{errors.password}</p>
          </div>
          <div>
            <label
              htmlFor="confirmpassword"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Confirm Password
            </label>
            <div className="flex relative">
              <input
                ref={confirmpasswordRef}
                autoComplete="true"
                type="password"
                id="confirmpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmpassword}
                placeholder="••••••••"
                className="app-input pr-10"
              />
              {!togglePasswordTwo ? (
                <ImEyeBlocked
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  onClick={togglePasswordVisibilityTwo}
                  size={18}
                />
              ) : (
                <ImEye
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-custom-blue cursor-pointer"
                  onClick={togglePasswordVisibilityTwo}
                  size={18}
                />
              )}
            </div>
            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">
              {errors.confirmpassword}
            </p>
          </div>

          <button
            type="submit"
            className="app-button-primary mt-4 w-full text-sm"
          >
            Create an Account
          </button>
          
          <p className="text-sm font-medium text-center text-slate-600 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-custom-blue hover:text-blue-800 font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
