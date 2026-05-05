import { ToastContainer } from "react-toastify";
import { SignInType } from "../../Interface/interface";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import signinSchema from "../../Validation/Admin/LoginSchema";
import { useForm } from "react-hook-form";
import LoginLeft from "../../Components/Admin/LoginLeft";
import { useDispatch } from "react-redux";
import adminApi from "../../Apis/admin";
import { adminLogin } from "../../Redux/Slice/Admin/adminSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signinSchema),
  });

  const onSubmit = async (adminData: SignInType) => {
    try {
      const signupResponse = await adminApi.signin(adminData);
      
      if(signupResponse?.data.status){
        
        dispatch(adminLogin(signupResponse.data.admin))

        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_42%,_#f8fafc_42%,_#eff6ff_100%)] px-4 py-8 lg:flex lg:items-center">
      <LoginLeft />
      <div className="w-full  flex  flex-col justify-center items-center ">
        <div className="app-surface-strong space-y-2 md:space-y-2 w-full max-w-xl rounded-[32px] p-8 flex flex-col  items-center">
          <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
            <strong className="text-white sm:text-white lg:text-gray-500">
              ADMIN SIGN
            </strong>
            <strong className="text-black lg:text-blue-800"> IN</strong>
          </h1>
          <form
            className="space-y-2 md:space-y-4 w-full p-2 sm:w-full md:w-auto lg:w-4/5"
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
                className="app-input"
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
                className="app-input"
              />
              <p className="text-red-500 text-sm mt-2">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="app-button-primary w-full text-sm"
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
