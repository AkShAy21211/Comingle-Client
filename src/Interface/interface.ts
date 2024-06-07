import { data } from "../Components/Admin/DashBoard/SectionThree";
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

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: number;
  password?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  profile: {
    image?: string;
    background?: string;
    bio: string;
    age: number;
    country: string;
    gender: string;
    isPremium?: boolean;
    followers?: string[];
    following?: string[];
    posts?: number;
  };
}

export interface PostsType {
  _id: string;
  userId: {

    _id:string;
    name:string;
    profile:{
      image:string;
    }
  };
  image: string[];
  description: string;
  isHidden: boolean;
  timestamp: Date;
  createdAt:string;
  updatedAt:string
}

export interface Follow {
  _id: string;
  recipient: string;
  requester: string;
  status: string;
  timestamp?: Date;
}

export interface NotificationsType {
  _id: string;
  userId: string;
  content: string;
  sourceId: {
    recipient: {
      name: string;
      _id: string;
      profile: {
        image: string;
      };
    };
    requester: {
      name: string;
      _id: string;
      profile: {
        image: string;
      };
    };
    status: string;
    _id: string;
  };
  type: string;
  isRead: boolean;
  createdAt: Date;
}
