/*
登录的用户信息
 */

const state={
    // 当前登录的用户信息
    user:{},
    userID:'',
    userName:'',
    userPwd:'',
}

const getters={
    userID: state => state.user.userID,
    userName: state => state.user.userName,
    userPwd: state => state.user.userPwd,
}

const mutations={
    removeUser(state){
        state.user={};
    },
    setUser(state, user) {
        state.user=user;
    },
}

export default{
    state,
    getters,
    mutations
}
