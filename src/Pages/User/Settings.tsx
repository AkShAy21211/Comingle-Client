import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { toggleMode } from "../../Redux/Slice/Theam/theamSlice";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";
import OtpInputBox from "react-otp-input";
import userApi from "../../Apis/user";
import { useFormik } from "formik";
import { Otp } from "../../Interface/interface";
import LogoutModal from "../../Components/Common/LogoutModal";

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
  const token = useSelector((state: RootState) => state.user.token);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  if (!isopen) return null;

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
      const response = await userApi.changePasswordVefifyOTp(email, otpData.otp);
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
      await userApi.updatePassword(password.trim(), token);
      handleReset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-[28px] border p-5 shadow-2xl ${isDarkMode ? "border-white/10 bg-slate-900 text-white" : "border-white/70 bg-white text-slate-900"}`}>
        <GiCancel className="float-end cursor-pointer" size={18} onClick={handleReset} />
        <p className="pt-2 text-center text-sm font-medium">
          {!isSubmit
            ? "Please verify your email"
            : isSubmit && !isHandled
              ? "Verify OTP"
              : "Enter new password"}
        </p>

        {!isSubmit && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="app-input"
              />
              <p className="mt-2 text-sm text-red-500">{emailError ? emailError : ""}</p>
            </div>
            <button className="flex h-12 w-12 items-center justify-center self-start rounded-2xl bg-emerald-500/10">
              <IoCheckmarkCircleSharp color="green" onClick={verifyEmail} size={25} />
            </button>
          </div>
        )}

        {isSubmit && !isHandled && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <OtpInputBox
              value={values.otp}
              numInputs={4}
              onChange={(otp) => setFieldValue("otp", otp)}
              inputType="tel"
              renderSeparator={<span className="px-1">-</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "48px",
                    marginTop: "10px",
                    padding: "10px",
                    color: "black",
                    fontSize: "18px",
                    height: "48px",
                    borderRadius: "14px",
                  }}
                />
              )}
            />
            <button
              onClick={() => handleSubmit()}
              className="app-button-primary mt-5 w-full text-sm"
            >
              Submit
            </button>
          </div>
        )}

        {isHandled ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="Password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="Password"
                type="password"
                placeholder="**************"
                className="app-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="Confirmpassword">Confirm password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="Confirmpassword"
                type="password"
                placeholder="**************"
                className="app-input"
              />
            </div>
            <p className="mt-1 text-sm text-red-500">{passwordError ? passwordError : ""}</p>
            <button
              type="submit"
              onClick={handleNewPassword}
              className="app-button-primary mt-2 w-full text-sm"
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
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isHandled, setIsHandled] = useState(false);

  return (
    <div className="col-span-full lg:col-start-2 lg:col-end-3">
      <div className="app-page pt-0">
        <div className={`app-panel mx-auto max-w-[860px] p-5 sm:p-8 ${isDarkMode ? "border-white/10 bg-slate-900/75 text-white" : ""}`}>
          <div className="mb-8">
            <span className="app-chip">Preferences</span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Account settings</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Update your login security and app appearance.
            </p>
          </div>

          <div className="space-y-4">
            <div className={`rounded-[24px] border p-4 sm:p-5 ${isDarkMode ? "border-white/10 bg-slate-950/40" : "border-slate-100 bg-slate-50/80"}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold sm:text-lg">Theme</h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Switch between light and dark mode.
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => dispatch(toggleMode())}
                    className="sr-only peer"
                  />
                  <div className="relative h-7 w-12 rounded-full bg-slate-300 peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:start-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className={`w-full rounded-[24px] border p-4 text-left transition-colors sm:p-5 ${
                isDarkMode ? "border-white/10 bg-slate-950/40 hover:bg-white/10" : "border-slate-100 bg-slate-50/80 hover:bg-slate-100"
              }`}
            >
              <h2 className="text-base font-semibold sm:text-lg">Change password</h2>
              <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Verify your email and set a new password.
              </p>
            </button>

            <button
              onClick={() => setLogoutModal(true)}
              className={`w-full rounded-[24px] border p-4 text-left transition-colors sm:p-5 ${
                isDarkMode ? "border-red-500/20 bg-red-500/10 hover:bg-red-500/15" : "border-red-100 bg-red-50 hover:bg-red-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-500">
                  <IoLogOutOutline size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-red-500 sm:text-lg">Sign out</h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? "text-red-200/80" : "text-red-500/80"}`}>
                    Log out from this account on this device.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

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
      {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
    </div>
  );
}

export default Settings;
