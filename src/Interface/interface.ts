export interface SignUpType {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}
export interface SignInType {
  email: string;
  password: string;
}

export interface OTPResend {
  duration: number;
  onResend: () => Promise<void>;
}

export interface Otp {
  otp: string;
}

export interface CurrentUser {
  _id: string;
  email: string;
  isBlocked: boolean;
  isVerfied: boolean;
  name: string;
  profile: {};
  token: string;
}


interface User{

    _id:string;
    name:string;
    email:string;
    phone:number;
    password?:string;
    isVerified?:boolean;
    isBlocked?:boolean;
    profile:{
        image?:string;
        background?:string;
        bio:string;
        age:number;
        country:string;
        gender:string;
        isPremium?:boolean;
        followers?:string[];
        following?:string[];
        posts?:number;
    }
    
}

export default User;