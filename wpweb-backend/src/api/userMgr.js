/*
用户管理服务
使用users缓存数据
每次读写持久化存储都是全量读写

字段：guid,name,pwd
 */

var users=[];
var fs=require("fs")
var fileName="./users.txt";

var readUsers=function () {
    users = [];
    var s = fs.readFileSync(fileName).toString();
    var ss = s.split("\n");
    for (i in ss){
        if (ss[i].length > 2){
            users.push(JSON.parse(ss[i]));
        }
    }
}

var writeUsers=function () {
    var s = "";
    for(i in users){
        s += JSON.stringify(users[i]) + "\n";
    }
    fs.writeFileSync(fileName, s);
}

//  读取数据库中的所有用户
var allUsers=function () {
    readUsers();
    return users;
};

var userByID=function (id) {
    readUsers();
    var index = userIndexInMem(id);
    if (index != -1){
        return users[index];
    }
    return null;
};

var addUser=function (u) {
    if (isValidUser(u) == false) {
        return;
    }
    var index = userIndexInMem(u['guid']);
    if (index != -1) {
        return;
    }
    users.push(clone(u));
    writeUsers();
}

var delUser=function (id) {
    var index = userIndexInMem(id);

    if (index != -1)
    {
        users.splice(index, 1);
        writeUsers();
    }
}

// modify or add new
var modifyUser=function (u) {
    if (isValidUser(u) == false) {
        return;
    }
    var index = userIndexInMem(u['guid']);
    if (index == -1) {
        addUser(u);
    }
    else {
        users[index] = clone(u);
        writeUsers();
    }
}

// 判断用户（json格式）是否格式合法
var isValidUser=function (u) {
    if (u == null) {
        return false;
    }
    if ((u['guid'] == null) || u['guid'] == '') {
        return false;
    }
    if ((u['name'] == null) || u['name'] == '') {
        return false;
    }
    return true;
}

// 在缓存数组中查找guid为id的用户下标，-1表示不存在
var userIndexInMem = function (id) {
    for(var i=0; i < users.length; i ++){
        if (users[i]['guid'] == id){
            return i;
        }
    }
    return -1;
}

// 复制对象
var clone=function (o) {
    return JSON.parse(JSON.stringify(o));
}

module.exports={
    allUsers,
    userByID,
    addUser,
    delUser,
    modifyUser,
    isValidUser,
};


