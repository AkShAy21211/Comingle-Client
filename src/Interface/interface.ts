export interface SignUpType {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
};
export interface SignInType {
  email: string;
  password: string;
};

export interface OTPResend{

  duration:number,
  onResend: ()=>Promise<void>;
}

export interface Otp {

  otp:"",
}