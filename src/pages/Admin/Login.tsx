import { ToastContainer } from "react-toastify";
import { SignInType } from "../../Interface/interface";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import signinSchema from "../../Validation/Admin/LoginSchema";
import { useForm } from "react-hook-form";
import LoginLeft from "../../Components/Admin/LoginLeft";

function Login() {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signinSchema),
  });

  const onSubmit = async (userData: SignInType) => {
    
  
  };
  return (
    <div className=" flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
     <LoginLeft/>
      <div className="w-full  flex  flex-col justify-center items-center ">
        <div className=" space-y-2 md:space-y-2 w-full flex flex-col  items-center">
          <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
            <strong className="text-white sm:text-white lg:text-gray-500">
              ADMIN SIGN
            </strong>
            <strong className="text-black lg:text-blue-800"> IN</strong>
          </h1>
          <form
            className="space-y-2 md:space-y-4 w-full p-5 sm:w-full md:w-auto lg:w-1/2"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                {...register("email")}
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@gmail.com"
              />
              <p className="text-red-500 text-sm mt-2">
                {errors.email?.message}
              </p>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p className="text-red-500 text-sm mt-2">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-black lg:bg-blue-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
            >
              SignIn
            </button>
            <p className="text-sm pt-0 font-light text-end text-white lg:text-black ">
              <Link
                to="#"
                className="font-medium  lg:text-blue-800 text-primary-600 hover:underline dark:text-primary-500"
              >
               Forget password
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
