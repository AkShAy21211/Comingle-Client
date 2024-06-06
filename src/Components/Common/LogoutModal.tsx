import { useDispatch } from "react-redux";
import { userLogout } from "../../Redux/Slice/User/userSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../Redux/store";
import Cookies from "js-cookie";
import userApi from "../../Apis/user";

type LogoutModalPro = {
  setLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function LogoutModal({ setLogoutModal }: LogoutModalPro) {
  const dispath = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {

        dispath(userLogout());
        persistor.purge();
        navigate("/login");
      
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <>
      <div
        id="popup-modal"
        className="fixed  inset-0 flex items-center justify-center z-50"
      >
        <div className="relative rounded-xl  lg:w-full max-w-md bg-black">
          <div className="relative  bg-white rounded-lg shadow dark:bg-custom-blue">
            <button
              type="button"
              onClick={() => setLogoutModal(false)}
              className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to logout?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={logout}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={() => setLogoutModal(false)}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogoutModal;
