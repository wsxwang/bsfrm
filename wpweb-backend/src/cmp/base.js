// 封装一些基础函数

// 日志封装
var log4js = require('log4js');
var cfg = require('../../config.json');
log4js.configure(cfg.log4js);
// 数据库操作的数据库记录日志
var logger4js_db=log4js.getLogger('db');
// access日志
var logger4js_access=log4js.getLogger('access');
// api访问日志
var logger4js_api=log4js.getLogger('api');
// 一般日志
var logger4js=log4js.getLogger('everything');


// 将字符串格式的json转换为object，如果s是oject格式则直接返回，其他情况返回null
var str2Json=function(s){
    if (typeof(s) == "string"){
        return JSON.parse(s);
    }
    if (typeof(s)=="object"){
        return s;
    }
    return null;
}

var newGuid=function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

module.exports = {
    str2Json,
    newGuid,
	
	logger4js,
	logger4js_db,
	logger4js_access,
	logger4js_api,
};