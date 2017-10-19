/*
自定义实体的api，涉及到两张元数据表：TBL_meta_EntityDefine，TBL_meta_EntityFieldDefine
-----------------------------
TBL_meta_EntityDefine:实体元数据定义
    ID:唯一标识，必填
    name:表名称，必填
    label:显示名称，必填
JSON格式：{
	ID:'xxx',
	name:'xxx',
	label:'xxx',
	fields:[{},{}...],		// 字段列表
}
-----------------------------
TBL_meta_EntityFieldDefine:实体字段元数据定义
    EID:实体ID（关联项）
    ID:唯一标识，必填
	name:字段名，必填
    label:显示名称
    type:单选：string,number,password,必填
    constraints:多选（逗号隔开）：unique,required
JSON格式：{
	EID:'xxx',		// api对外不公开
	ID:'xxx',
	name:'xxx',
	label:'xxx',
	type:'xxx',
	constraints:'xxx,xxx',
}
-----------------------------
持久化：sqlite数据库文件：../../public/db/TBL_meta_data.db
-----------------------------
数据表命名：TBL_Entity_name
-----------------------------
异常处理：抛出
所有函数均为同步处理函数
*/

var assert=require('assert');
var fs=require("fs");
var path = require('path');
var sqlite3=require('sqlite3');
var dbOpr=require('../cmp/dbOpr_sqlite')

const fileName_db = path.join(__dirname, '../../public/db/TBL_meta_data.db')

// 从元数据库中读取所有实体定义（不包含字段），返回数组
var allEntity=function () {
	var ret = dbOpr.exec_sync(fileName_db, 'SELECT ID,name,label FROM TBL_meta_EntityDefine');
	if('error' in ret){
		throw ret;
	}
	return ret;
}

// 从元数据库中读取所有字段定义，返回数组
var allFields=function () {
    var ret = dbOpr.exec_sync(fileName_db, 'SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine');
    console.log(ret);
    if('error' in ret){
        throw ret;
    }
    return ret;
}

// 从元数据库中根据id查找实体定义，返回JSON对象，未找到则返回null
var entityByID=function (id) {
    var ret = dbOpr.exec_sync(fileName_db, "SELECT ID,name,label FROM TBL_meta_EntityDefine WHERE ID='" + id + "'");
    if('error' in ret){
        throw ret;
    }
    return ret[0];
}

// 从元数据库中根据实体ID查找对应的字段定义，返回数组
var fieldsByEID=function (eid) {
    var ret = dbOpr.exec_sync(fileName_db, "SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine WHERE EID='" + eid + "'");
    console.log(ret);
    if('error' in ret){
        throw ret;
    }
    return ret;
}

// 从元数据库中根据字段ID查找对应的字段定义
var fieldByID=function (id) {
    var ret = dbOpr.exec_sync(fileName_db, "SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine WHERE ID='" + id + "'");
    console.log(ret);
    if('error' in ret){
        throw ret;
    }
    return ret[0];
}

// 向元数据库中插入一批实体定义（不包含字段）
var insertEntitys=function (entitys) {
    for(var i in entitys){
        if(checkEntityFmt(entitys[i]) == false){
            throw new Error('format error');
        }
    }
    var ret = dbOpr.insert_sync(fileName_db, 'TBL_meta_EntityDefine', entitys);
    if('error' in ret){
        throw ret;
    }
}

// 向元数据库中插入一批字段定义
var insertFields=function (fields) {
 	for(var i in fields){
        if(checkFieldFmt(fields[i]) == false){
            throw new Error('format error');
        }
	}

    var ret = dbOpr.insert_sync(fileName_db, 'TBL_meta_EntityFieldDefine', fields);
    if('error' in ret){
        throw ret;
    }
}

// 在元数据库中更新一个实体定义
var updateEntitys=function (entitys) {
    for(var i in entitys){
        if(checkEntityFmt(entitys[i]) == false){
            throw new Error('entity format error');
        }
    }

    var sqlArray = [];
    for(var i in entitys) {
        var sqlStr = "UPDATE TBL_meta_EntityDefine SET "
            + " name='" + entitys[i]['name']
            + "', label='" + entitys[i]['label']
            + "' WHERE ID='" + entitys[i]['ID'] + "'";
        sqlArray.push(sqlStr);
    }

    var ret = dbOpr.execBatch_sync(fileName_db, sqlArray);
    if ('error' in ret) {
        throw ret;
    }
}

// 在元数据库中更新一批字段定义
var updateFields=function (fields) {
    for(var i in fields){
        if(checkFieldFmt(fields[i]) == false){
            throw new Error('field format error');
        }
    }

    var sqlArray = [];
    for(var i in fields) {
        var sqlStr = "UPDATE TBL_meta_EntityFieldDefine SET "
            + "EID='" + fields[i]['EID']
            + "', name='" + fields[i]['name']
            + "', label='" + fields[i]['label']
            + "', type='" + fields[i]['type']
            + "', constraints='" + fields[i]['constraints']
            + "' WHERE ID='" + fields[i]['ID'] + "'";
        sqlArray.push(sqlStr);
    }
    var ret = dbOpr.execBatch_sync(fileName_db, sqlArray);
    if ('error' in ret) {
        throw ret;
    }
}

// 从元数据库中删除指定ID的实体定义
var delEntity=function (id) {
    var sqlStr = "DELETE FROM TBL_meta_EntityDefine WHERE ID = '" + id + "'";
    var ret = dbOpr.exec_sync(fileName_db, sqlStr);
    if (typeof (ret) != 'number') {
        throw ret;
    }
}

// 从元数据库中删除指定ID的字段定义
var delField=function (id) {
    var sqlStr = "DELETE FROM TBL_meta_EntityFieldDefine WHERE ID = '" + id + "'";
    var ret = dbOpr.exec_sync(fileName_db, sqlStr);
    if (typeof (ret) != 'number') {
        throw ret;
    }
}

// 从元数据库中删除指定EID（实体定义ID）的字段定义
var delFieldsByEID=function (eid) {
    var sqlStr = "DELETE FROM TBL_meta_EntityFieldDefine WHERE EID = '" + eid + "'";
    var ret = dbOpr.exec_sync(fileName_db, sqlStr);
    if (typeof (ret) != 'number') {
        throw ret;
    }
}

/*
判断实体定义格式是否合法
不检测ID是否重复
*/
var checkEntityFmt=function (entity) {
    if (entity == null) {
        return false;
    }
    if ((entity['ID'] == null) || entity['ID'] == '') {
        return false;
    }
    if ((entity['name'] == null) || entity['name'] == '') {
        return false;
    }
    if ((entity['label'] == null) || entity['label'] == '') {
        return false;
    }
    return true;
}

/*
判断实体定义格式是否合法
不检测ID是否重复，不检测EID是否存在
*/
var checkFieldFmt=function (field) {
    if (field == null) {
        return false;
    }
    if ((field['EID'] == null) || field['EID'] == '') {
        return false;
    }
    if ((field['ID'] == null) || field['ID'] == '') {
        return false;
    }
    if ((field['name'] == null) || field['name'] == '') {
        return false;
    }
    if ((field['type'] == null) || field['type'] == '') {
        return false;
    }
    return true;
}

module.exports={
    allEntity,
    allFields,
    entityByID,
    fieldsByEID,
    fieldByID,
    insertEntitys,
    insertFields,
    updateEntitys,
    updateFields,
    delEntity,
    delField,
    delFieldsByEID,
};

