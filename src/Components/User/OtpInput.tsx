import OtpInputBox from "react-otp-input";
import { Otp } from "../../Interface/interface";
import userApi from "../../Apis/user";
import Timer from "../Common/Timer";


interface OtpInputProps {
  handleSubmit: () => void;
  values:Otp;
  setFieldValue :(feils:string,value:any)=>void;
  verficationType:string;
}

function OtpInput({handleSubmit,values,setFieldValue,verficationType}:OtpInputProps) {


  return (
    <div className="relative flex flex-col justify-center max-w-sm sm:max-w-md lg:max-w-full rounded">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto lg:w-full rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>{verficationType === 'forgot'?'OTP Verificatioin':'Email Verification'}</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email address</p>
            </div>
          </div>

          <div>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <OtpInputBox
                    value={values.otp}
                    onChange={(otp) => setFieldValue("otp", otp)}
                    numInputs={4}
                    inputType="tel"
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "75px",
                          padding: "30px",
                          fontSize: "20px",
                          height: "60px",
                          border: "1px solid #ccc",
                        }}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-900 border-none text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                 
                   <Timer  duration={60} onResend={userApi.resendOTP}/>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpInput;
