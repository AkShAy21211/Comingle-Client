import { Link } from "react-router-dom";
import LoginLeft from "../../Components/User/Miscellaneous/LoginLeft";
import signUpScheema from "../../Validation/User/RegisterSchema";
import { useFormik } from "formik";
import { SignUpType } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {

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
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: signUpScheema,
    onSubmit: onSubmit,
  });

  async function onSubmit(formData: SignUpType) {
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
    <div className="flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text=" Unlock a world of connections. Join us today!" />
      <div className="w-full  flex  flex-col justify-center items-center ">
        <div className=" space-y-2 md:space-y-2 w-full flex flex-col  items-center">
          <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
            <strong className="text-white sm:text-white lg:text-gray-500">
              SIGN
            </strong>
            <strong className="text-black lg:text-blue-800"> UP</strong>
          </h1>
          <form
            className="space-y-2 md:space-y-4  w-auto"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="w-full ">
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
              <input
                onChange={handleChange}
                type="password"
                id="password"
                onBlur={handleBlur}
                value={values.password}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900"
              >
                Confirm password
              </label>
              <input
                type="confirmpassword"
                id="confirmpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmpassword}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
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
            <p className="text-sm font-light text-white lg:text-black">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium  lg:text-blue-800  text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
