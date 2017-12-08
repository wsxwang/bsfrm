/*
用户管理服务
基于custom_entity_data模块
函数为同步调用，错误采用异常抛出方式
字段：guid,name,pwd
*/

var api=require("./custom_entity_data");
const entity_name="user";

//  读取数据库中的所有用户
var allUsers=function () {
	return api.allRecords(entity_name);
}; 

var userByID=function (id) {
	return api.recordByGuid(entity_name, id);
};

var delUser=function (id) {
	api.delRecords(entity_name, id);
}

var addUser=function (u) {
	modifyUser(u);
}

// modify or add new
var modifyUser=function (u) {
	api.updateRecords(entity_name, [u]);
}

module.exports={
    allUsers,
    userByID,
	addUser,
    delUser,
    modifyUser,
};


