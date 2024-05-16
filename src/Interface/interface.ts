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

export interface Otp {

  otp:"",
}