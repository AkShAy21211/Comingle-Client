const adminEndPoints = {


    login:'/admin/signin',
    GET_PLAN_DETAILS:'/admin/subscription/get-plans',
    CREATE_PLAN:'/admin/subscription/create/plan',
    UPDATE_PLAN:'/admin/subscription/update/plan',
    GET_USERS:'/admin/users',
    BLOCK_UNBLOCK_USER:'/admin/user/block-unblock',
    GET_POSTS:'/admin/post/all',
    HIDE_UNHIDE_POST:'/admin/post/hide-unhide',
    DISMISS_REPORT:"/admin/post/dismiss/reports",
    GET_POST_REACTIOINS:"/admin/post/reactions",
    ANALYTICS:"/admin/dashboard/analytics",
    GET_SUBSCRIPTIONS:'/admin/subscriptions',




}

export default adminEndPoints;