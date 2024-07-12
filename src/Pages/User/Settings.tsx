import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutModal from "../../Components/Common/LogoutModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { toggleMode } from "../../Redux/Slice/Theam/theamSlice";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import OtpInputBox from "react-otp-input";
import userApi from "../../Apis/user";
import { useFormik } from "formik";
import { Otp } from "../../Interface/interface";

type EmailVerificationModal = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmit: boolean;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  isHandled: boolean;
  setIsHandled: React.Dispatch<React.SetStateAction<boolean>>;
  isopen: boolean;
};
const EmailVerificationModal = ({
  isopen,
  setIsOpen,
  setIsSubmit,
  setIsHandled,
  isHandled,
  isSubmit,
}: EmailVerificationModal) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordErrror] = useState("");
  const token = useSelector((state:RootState)=>state.user.token)

  if (!isopen) return;

  const verifyEmail = async () => {
    if (!email.trim()) {
      setEmailError("Enter your email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }
    setEmailError("");
    try {
      await userApi.changePasswordVefifyMail(email);
      setIsSubmit(true);
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
    }
  };

  const handleReset = () => {
    setIsHandled(false);
    setIsOpen(false);
    setIsSubmit(false);
  };
  const { handleSubmit, values, setFieldValue } = useFormik<Otp>({
    initialValues: {
      otp: "",
    },

    onSubmit: onSubmit,
  });

  async function onSubmit(otpData: Otp) {
    try {
      const response = await userApi.changePasswordVefifyOTp(
        email,
        otpData.otp
      );
      if (response) {
        setIsHandled(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNewPassword = async () => {
    if (!password.trim()) {
      setPasswordErrror("Enter new password");
      return;
    }
  
    if (password.trim() !== confirmPassword.trim()) {
      setPasswordErrror("Password should match");
      return;
    }

    try {
      await userApi.updatePassword(password.trim(),token);
      handleReset()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex jc items-center justify-center bg-opacity-75 z-50">
      <div className=" backdrop-blur-xl border shadow-lg gap-2  py-5  rounded-lg px-5 m-5">
        <GiCancel className="float-end" size={15} onClick={handleReset} />
        <p className=" text-sm text-center flex justify-center gap-3">
          {!isSubmit
            ? "Please verify your email"
            : isSubmit && !isHandled
            ? "Verify OTP"
            : "Enter new password"}
        </p>

        {!isSubmit && (
          <div className="flex w-full justify-center gap-3 mt-3">
            <div className="flex-col gap-3">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-auto p-1 bg-transparent border focus:outline-none   rounded "
              />
              <p className="text-sm mt-2 text-red-500">
                {emailError ? emailError : ""}
              </p>
            </div>
            <button
              // onClick={onVerify}
              className=" text-white  rounded "
            >
              <IoCheckmarkCircleSharp
                color="green"
                onClick={verifyEmail}
                size={25}
              />
            </button>
          </div>
        )}
        {isSubmit && !isHandled && (
          <div className="w-full flex-col  justify-center items-center">
            <OtpInputBox
              value={values.otp}
              numInputs={4}
              onChange={(otp) => setFieldValue("otp", otp)}
              inputType="tel"
              renderSeparator={<span>-</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "40px",
                    marginTop: "10px",
                    padding: "13px",
                    color: `black`,
                    fontSize: "20px",
                    height: "40px",
                    borderRadius: "20%",
                  }}
                />
              )}
            />
            <button
              onClick={() => handleSubmit()}
              className="text-center w-full mt-4 bg-custom-blue  py-1 rounded-lg text-white"
            >
              Submit
            </button>
          </div>
        )}
        {isHandled ? (
          <div className="flex flex-col w-full justify-center gap-3 mt-3">
            <div className=" flex flex-col w-full">
              <label htmlFor="Password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="Password"
                type="email"
                placeholder="**************"
                className="w-auto px-1 py-1  text-black  border focus:outline-none   rounded-lg "
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="Confirmpassword">Confirm password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="Confirmpassword"
                type="email"
                placeholder="**************"
                className="w-auto px-1 py-1 text-black  border focus:outline-none   rounded-lg "
              />
            </div>
            <p className="text-sm mt-2 text-red-500">
              {passwordError ? passwordError : ""}
            </p>
            <button
              type="submit"
              onClick={handleNewPassword}
              className="text-center w-full mt-4 bg-custom-blue  py-1 rounded-lg text-white"
            >
              Submit
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function Settings() {
  const [logoutModal, setLogoutModal] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isHandled, setIsHandled] = useState(false);

  return (
    <div
      className={` h-screen  flex ${
        isDarkMode ? "bg-black text-white " : ""
      } gap-10  flex-col overflow-hidden col-span-full mt-18 pt-20  lg:col-start-2 lg:col-end-5`}
    >
      {/* <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        Personal Details
      </h1> */}
      <ul className="h-auto   mt-10  w-full text-nowrap space-y-10  pl-10 lg:pl-0 text-md">
        <li className="lg:text-center w-auto flex lg:block ">
          <Link
            to="/details"
            className="hover:bg-custom-blue/40  px-2 py-3 rounded-lg"
          >
            Edit personal details
          </Link>
        </li>

        {/* <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        Account seetings
      </h1> */}
        <li className="lg:text-center">
          <Link
            onClick={() => setIsOpen(true)}
            className="hover:bg-custom-blue/40   px-2  py-3 rounded-lg"
            to={""}
          >
            Change Password{" "}
          </Link>
        </li>

        {/* <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
       Subscription
      </h1> */}
        <li className="lg:text-center ">
          <Link
            className="hover:bg-custom-blue/40 py-3  px-2 rounded-lg"
            to={"/settings/subscription"}
          >
            Upgrade to premium
          </Link>
        </li>

        {/* <h1 className={`${isDarkMode?'text-white':""}  p-5 text-lg  lg:text-center font-bold`}>
        App seetings
      </h1> */}

        <li className="lg:text-center flex lg:block  px-2">
          <p>Theam</p>
          <label className="inline-flex mx-3 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => dispatch(toggleMode())}
              className="sr-only peer "
            />
            <div className="relative w-11   h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </li>

        <li className="lg:text-center flex lg:block  px-2">
          <Link
            to=""
            onClick={() => setLogoutModal(true)}
            className="text-red-500 lg:text-center  font-bold text-xl mt-5 w-auto"
          >
            Logout
          </Link>
        </li>
      </ul>

      {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
      {isOpen ? (
        <EmailVerificationModal
          isHandled={isHandled}
          setIsHandled={setIsHandled}
          isSubmit={isSubmit}
          setIsSubmit={setIsSubmit}
          isopen
          setIsOpen={setIsOpen}
        />
      ) : null}
    </div>
  );
}

export default Settings;
