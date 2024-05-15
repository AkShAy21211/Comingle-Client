import { Link } from "react-router-dom";
import LoginLeft from "../../Components/User/LoginLeft";

function Login() {
  return (
    <div className="flex bg-blue-900 lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text="Unlock a world of connections. Join us today!" />
      <div className="w-full  flex  flex-col justify-center items-center  ">
        <div className=" space-y-4 md:space-y-6 w-full flex flex-col  items-center">
          <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 ">
            <strong className="text-white sm:text-white lg:text-gray-500">
              SIGN
            </strong>
            <strong className="text-black lg:text-blue-800"> UP</strong>
          </h1>
          <form className="space-y-4 md:space-y-6" action="#">
            <div className="w-full ">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium  text-white sm:text-white lg:text-gray-900"
              >
                Your Name
              </label>
              <input
                type="name"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                placeholder="Enter your name"
              />
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
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
              />
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
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-white sm:text-white lg:text-gray-900"
              >
                Confirm password
              </label>
              <input
                type="confirm-password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-black lg:bg-blue-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
            >
              Create an account
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
