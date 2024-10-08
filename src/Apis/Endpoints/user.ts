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
    NEW_POST:'/user/new-post',
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
    GET_PLANS:'/user/application/plans',
    DELETE_POSTS:"/user/post/delete",
    DELETE_COMMENT:"/user/comment/delete",
    EDIT_COMMENT:"/user/comment/edit/",
    EDIT_POST:"/user//post/edit",
    GET_FRIENDS:"/user/list-friends",
    SEARCH_USERS:'/user/search',
    GET_SIGNLE_POST:"/user/post",
    UNFOLLOW:"/user/unfollow",
    FRIENDS_SUGGESTIONS:"/user/friends/suggestions",
    CHANGE_PASSWORD_VEIFY_MAIL:"/user/change-password/send-otp",
    CHANGE_PASSWORD_VEIFY_OTP:"/user/change-password/verify-otp",
    LOGOUT:'/user/logout'

    

}


export default userEnpoints;