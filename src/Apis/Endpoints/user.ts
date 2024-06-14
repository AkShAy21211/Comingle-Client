const userEnpoints = {


    SIGNUP:'/user/signup',
    VERIFYOTP:'/user/signup/verify-otp',
    RESEND_OTP:'/user/signup/verify-otp/resend',
    SIGNIN:'/user/signin',
    GOOGLE_LOGIN:'/user/auth/google',
    PROFILE:'/user/profile',
    PROFILE_UPDATE_COVER:'/user/profile/update/cover',
    PROFILE_UPDATE_DP:'/user/profile/update/dp',
    PROFILE_UPDATE_INFO:'user/profile/update/info',
    FORGOT_PASSWORD:'/user/forgot-password',
    UPDATE_PASSWORD:'/user/new-password',
    GET_ALL_USERS:'/user/list-all',
    FOLLOW_REQUEST:'/user/follow-request',
    NOTIFICATIONS:'/user/notifications',
    FOLLOW_STATUS:'/user/follow/status',
    ACCEPT_FOLLOW:'/user/follow/accept',
    NEW_POST:'/user//new-post',
    GET_ALL_POSTS:'/user/posts/all',
    LIKE_POST:'/user/posts/like',
    UNLIKE_POST:'/user/posts/unlike',
    COMMENT:'/user/posts/comment',
    CHECK_USERNAME:'/user/signup',
    GET_KEY:'/user/rozarpay/get-key_id',
    UPGRADE_PREMIUM:"/user/rozarpay/create-premium-order",
    VERIFY_PREMIUM:"/user/rozarpay/premium-order/verify",
    REPORT_POST:'/user/posts/report',
    FETCH_ALL_CHAT:'/user/chat/fetch-all',
    ACCESS_CHAT:'/user/chat/access',
    FETCH_ALL_MESSAGES:'/user/chat',
    SEND_NEW_MESSAGE:"/user/chat/new-message",
    OTHER_USER_PROFILE:'/user/profile',
    LOGOUT:'/user/logout'

    

}


export default userEnpoints;