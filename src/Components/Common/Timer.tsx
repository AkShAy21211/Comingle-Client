import React, { useState, useEffect } from 'react';
import { OTPResend } from '../../Interface/interface';

const Timer= ({ duration, onResend }:OTPResend) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [secondsLeft]);

  const handleResendClick = async() => {
    setIsResendDisabled(true);
    setSecondsLeft(duration);
    await onResend()
    
  };

  return (
  
    <>
      <p className='mt-2'> {isResendDisabled?<b>Didn't receive code? </b>:null} {isResendDisabled ? `Resend OTP in ${secondsLeft}s` : 'You can resend the OTP now.'}</p>
      <button className='text-blue-800 font-bold mt-2' onClick={handleResendClick} disabled={isResendDisabled}>
        Resend OTP
      </button></>

  );
};

export default Timer;
