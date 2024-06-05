import { useState } from "react";
import ForgetPsswordLeft from "../../Components/User/LoginLeft";
import OtpInput from "../../Components/User/OtpInput";
import { useFormik } from "formik";
import { Otp } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { Link, useNavigate } from "react-router-dom";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //////////////////////// states to render email,otp,newPassword inputs ////////////////////////

  const [isEmailSubmit, setIsEmailSubmit] = useState(false);
  const [isOtpSubmit, setIsOtpSubmit] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);

  /////////////// handling ot value ///////////////////////////
  const { handleSubmit, values, setFieldValue } = useFormik<Otp>({
    initialValues: {
      otp: "",
    },
    onSubmit: handleOtpSubmit,
  });

  ////////////////////// Email submit  handler /////////////////////////

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleEmailSubmit() {
    if (!email) {
      setError("Pleas enter your email");
      return;
    }
    const isValaid = validateEmail(email);
    if (!isValaid) {
      setError("Invalid email");
      return;
    }

    setError("");

    try {
      console.log(email);

      const response = await userApi.forgotPassword(email);

      if (response?.status) {
        setIsEmailSubmit(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ////////////////  OTP Submit handler ///////////////////////////////////
  async function handleOtpSubmit(OTP: Otp) {
    try {
      console.log(values.otp);

      const response = await userApi.verifyOtp(OTP);

      if (response?.status) {
        setIsOtpSubmit(true);
        setIsEmailSubmit(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //////////////// handling new password /////////////////

  const [password, setPPassword] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toogle, setTogle] = useState(false);





async function handleNewPassword() {
  let errors = [];

  // Password validation
  if (password.length < 5) {
    errors.push("Password must be at least 5 characters long");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter");
  }
  if (!/[^\w]/.test(password)) {
    errors.push("Password must contain a symbol");
  }

  // Check for other errors
  if (!password || !confirmPassword) {
    errors.push("Please enter password in both fields");
  }

  if (password !== confirmPassword) {
    errors.push("Passwords should match");
  }

  if (errors.length > 0) {
    setpasswordError(errors[0]); 
    return; 
  }


  setpasswordError("");

  try {
    console.log('new password',password);
    
    const response = await userApi.updatePassword(password);
    if (response?.status) {
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
}


  return (
    <div className="flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <ForgetPsswordLeft text="Forgot your password? Don't worry, we've got you covered." />
      <div className="w-full  flex  flex-col justify-center items-center ">
        {!isEmailSubmit && !isOtpSubmit && (
          <>
            <p className="  sm:block  text-xl text-white lg:text-black text-center - mb-12font-sans">
              Forgot your password?
            </p>
            <div className="relative mb-3 mt-12 " data-twe-input-wrapper-init>
              <label className=" left-3 top-0 mb-0 max-w-[90%] origin-[0_0] sm:text-sm truncate pt-[0.37rem] leading-[1.6] text-balance transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400  lg:dark:text-black dark:peer-focus:text-primary">
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" lg:text-black w-60 border focus:ring-custom-blue block min-h-[auto]  border-black rounded border-r-2 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear  data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none  dark:autofill:shadow-autofill "
                id="exampleFormControlInput1"
                placeholder="example@gmail.com"
              />
              <p><Link to='/login' className="text-end float-end mt-2 text-white lg:text-blue-800 text-sm">Back to login</Link></p>
                <p className="text-red-500 mt-2 text-sm ">{error}</p>

            </div>

            <button
              onClick={handleEmailSubmit}
              className=" bg-black w-auto px-24 lg:bg-custom-blue  text-white p-2 rounded-lg"
            >
              Submit
            </button>
          </>
        )}

        {isEmailSubmit && (
          <OtpInput
            verficationType="forgot"
            values={values}
            handleSubmit={handleSubmit}
            setFieldValue={setFieldValue}
          />
        )}

        {isOtpSubmit && (
          <>
            <p className="  sm:block font-serif text-xl text-center -mt-32 mb-12 text-white lg:text-black ">
              Enter your new password
            </p>
            <div className=" mb-3 ">
              <label className=" left-3 top-0 mb-0 max-w-[90%] origin-[0_0] sm:text-sm truncate pt-[0.37rem] leading-[1.6] text-balance transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400  lg:dark:text-black dark:peer-focus:text-primary">
                Password
              </label>
              <input
                type={`${toogle ? "text" : "password"}`}
                value={password}
                onFocus={() => setTogle((prev) => !prev)}
                onChange={(e) => setPPassword(e.target.value)}
                className=" lg:text-black w-60 border focus:ring-custom-blue block min-h-[auto]  border-black rounded border-r-2 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear  data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none  dark:autofill:shadow-autofill "
                id="password"
                placeholder="example@gmail.com"
              />
              <p className="text-red-500 mt-2 text-sm">{error}</p>
              <label className=" left-3 top-0 mb-0 max-w-[90%] origin-[0_0] sm:text-sm truncate pt-[0.37rem] leading-[1.6] text-balance transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400  lg:dark:text-black dark:peer-focus:text-primary">
                Confirm password
              </label>
              <input
                type={`${toogle ? "text" : "password"}`}
                value={confirmPassword}
                onFocus={() => setTogle((prev) => !prev)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className=" lg:text-black w-60 border focus:ring-custom-blue block min-h-[auto]  border-black rounded border-r-2 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear  data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none  dark:autofill:shadow-autofill "
                id="confirmpassword"
                placeholder="example@gmail.com"
              />
            </div>
           <p className="text-red-500 mt-1 mb-2 text-sm   text-center  ">{passwordError}</p>

            <button
              onClick={handleNewPassword}
              className=" bg-black lg:bg-custom-blue w-60 text-white p-2 rounded-lg"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
