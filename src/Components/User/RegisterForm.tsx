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
    <div className="w-full  flex  flex-col justify-center items-center  ">
      <div className=" space-y-2 md:space-y-2 w-full flex flex-col  items-center">
        <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
          <strong className="text-white sm:text-white lg:text-gray-500">
            SIGN
          </strong>
          <strong className="text-black lg:text-blue-800"> UP</strong>
        </h1>
        <form
          className="space-y-2 md:space-y-1  w-full p-5 sm:w-full md:w-96"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className=" ">
            <label
              htmlFor="name"
              className="block mb-2  text-sm font-medium  text-white sm:text-white lg:text-gray-900"
            >
              Your Name
            </label>
            <input
              type="name"
              onChange={handleChange}
              id="name"
              value={values.name}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Enter your name"
            />
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          </div>
          <div className="w-full ">
            <label
              htmlFor="username"
              className="block mb-2  text-sm font-medium  text-white sm:text-white lg:text-gray-900"
            >
              Username
            </label>
            <input
              type="username"
              onChange={(e) => {
                handleChange(e);
                handleUsernameChange(e);
              }}
              id="username"
              value={values.username}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Enter a unique username"
            />
            <p className="text-red-500 text-sm mt-2">
              {errors.username || usernameError}
            </p>
            {loading && (
              <div role="status" className="float-end w">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {validUsername && (
              <div role="status" className="float-end w">
                <GiConfirmed size={20} color="green" />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              onBlur={handleBlur}
              id="email"
              onChange={handleChange}
              value={values.email}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
            />
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900 "
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900"
            >
              Confirm password
            </label>
            <div className="flex relative">
              <input
                ref={confirmpasswordRef}
                autoComplete="true"
                type="confirmpassword"
                id="confirmpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmpassword}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {!togglePasswordTwo ? (
                <ImEyeBlocked
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibilityTwo}
                />
              ) : (
                <ImEye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibilityTwo}
                />
              )}
            </div>
            <p className="text-red-500 text-sm mt-2">
              {errors.confirmpassword}
            </p>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-black lg:bg-blue-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
          >
            Create an account
          </button>
          <p className="text-sm font-light text-center text-white lg:text-black">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium  lg:text-blue-800  text-primary-600 hover:underline dark:text-primary-500"
            >
              Signin here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
