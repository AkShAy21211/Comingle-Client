import { data } from "../Components/Admin/DashBoard/SectionThree";
export interface SignUpType {
  name: string;
  username:string;
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
  username:string;
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

export interface Comment {

    _id: string;
    comment: string;
    commenter: string;
    commenterImage: string;

    createdAt: Date;
  
}

export interface Likes {
  _id: string;
  userId: [string];
  postId: string;
  createdAt: Date;
}
export interface PostsType {
  _id: string;
  comments: Comment[];
  likes: Likes;
  postedUser: {
    _id: string;
    username: string;
    profile: {
      image: string;
    };
  };
  image: string[];
  description: string;
  isHidden: boolean;
  timestamp: Date;
  createdAt: string;
  updatedAt: string;
}

export interface ReportType{

  postId:string;
  reason:string;

}
export interface Follow {
  _id: string;
  recipient: string;
  requester: string;
  status: string;
  timestamp?: Date;
}

export interface FollowNotification {
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
export interface LikeNotfication {
  _id: string;
  userId: string;
  content: string;
  sourceId: {
    createdAt: Date;
    postId: string;
    userId: [
      {
        _id: string;
        name: string;
        profile: {
          image: string;
        };
      }
    ];
    _id: string;
  };
  type: string;
  isRead: boolean;
  createdAt: Date;
}



//////////////////////////////////////////


export interface Plans{

  _id:string;
  title:string;
  benefits:string[];
  amount:number;
}