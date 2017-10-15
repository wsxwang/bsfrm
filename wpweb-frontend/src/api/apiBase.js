// 封装一些基础函数

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

export default {
    str2Json,
    newGuid
};