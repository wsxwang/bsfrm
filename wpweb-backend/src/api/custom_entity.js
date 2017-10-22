/*
元数据文件：/public/db/meta_data.db

自定义实体的元数据
表名：TBL_meta_EntityDefine
	name:实体名，唯一标识，用于健表
    label:显示名称
	title:备注

自定义实体的字段元数据
表名：TBL_meta_EntityFieldDefine
    eName:实体name（关联项）
	name:字段名，必填，与数据表对应
    label:显示名称
	title:备注

完整的自定义实体元数据格式为：
{
	name:'unique notnull string as entity name',
	label:'string notnull as entity label',
	title:'string as entity remark',
	fields:[
		{
			name:'string notnull as column name',
			label:'string notnull as column shown label',
			type:'string notnull as column type',
			title:'string as column remark'
		},
		{},
		...
	],
}

注意：定制实体的数据表中会加入默认字段：guid





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
持久化：sqlite数据库文件：../../public/db/meta_data.db
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

const fileName_meta = path.join(__dirname, '../../public/db/meta_data.db')
const fileName_data = path.join(__dirname, '../../public/db/custom_data.db')

// 返回所有实体定义（包含字段），返回数组
var allCompleteEntityMetaData=function () {
	var sqlStr = "";
	var ret = [];
	
	var names = allEntityName();	
	for(var i in names){
		var metadata = completeEntityMetaData(names[i]);
		if(metadata['name'] != null){
			ret.push(metadata);
		}
	}

	return ret;
}

// 返回所有实体名(name)，返回数组
var allEntityName=function(){
	var sqlStr = "";
	var ret = [];
	
	// 在数据文件中查找实体的数据表
	sqlStr = "SELECT tbl_name FROM SQLITE_MASTER WHERE tbl_name like 'TBL_DATA_%'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	if (data_ret.length == 0) return ret;	// 实体不存在
	
	for(var i in data_ret){
		ret.push(data_ret[i]['tbl_name'].substring(9));
	}

	return ret;
}

// 根据实体name字段获取该实体的完整元数据（包括字段定义）
var completeEntityMetaData=function(name){
	var sqlStr = "";
	var ret = {};
	
	// 在数据文件中查找是否存在该实体的数据表
	sqlStr = "SELECT tbl_name FROM SQLITE_MASTER WHERE tbl_name = 'TBL_DATA_" + name + "'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	if (data_ret.length != 1) return ret;	// 实体不存在

	// 在元数据表中查找实体的定义
	sqlStr = "SELECT name,label,title FROM TBL_meta_EntityDefine WHERE name='" + name + "'";
    meta_ret = dbOpr.exec_sync(fileName_meta, sqlStr);
	if ('error' in meta_ret){throw meta_ret;}
	if (meta_ret.length != 1) return ret;	// 实体元数据不存在

	ret['name'] = name;
	ret['label'] = meta_ret[0]['label'];
	ret['title'] = meta_ret[0]['title'];

	// 查找该表的所有字段
	sqlStr = "PRAGMA TABLE_INFO('TBL_DATA_" + name + "')";
    data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	
	// 在元数据表中查找字段的定义
	sqlStr = "SELECT eName,name,label,title FROM TBL_meta_EntityFieldDefine WHERE eName='" + name + "'";
    meta_ret = dbOpr.exec_sync(fileName_meta, sqlStr);
	if ('error' in meta_ret){throw meta_ret;}

	// 两个返回值join，以实际的数据表为基准
	var fields=[];
	for(var i in data_ret){
		if(data_ret[i]['name']=='guid'){continue;}
		var field = {};
		field['name'] = data_ret[i]['name'];
		field['type'] = data_ret[i]['type'];
		for(var j in meta_ret){
			if(meta_ret[j]['name']==data_ret[i]['name']){
				field['label'] = meta_ret[j]['label'];
				field['title'] = meta_ret[j]['title'];
			}
		}
		fields.push(field);
	}
	ret['fields'] = fields;
	return ret;
}

// 新建一个实体定义（包含字段），将创建实体元数据及数据表
var newEntity=function (entity) {
	var sqlStr = '';
	var ret = null;
	
	if(checkEntityFmt(entity) == false){
        throw Error('format error');
	}
	
	// 创建数据表
	sqlStr="CREATE TABLE TBL_DATA_" + entity['name'] + "(guid varchar2(255)";
	for(var i in entity['fields']){
		var field = entity['fields'][i];
		sqlStr += ','
		sqlStr += field['name'];
		sqlStr += " varchar2(255)";
	}
	sqlStr += ");";
	ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if('error' in ret){
        throw ret;
    }

	// 插入实体元数据定义
	var insertEntitys=[{name:entity['name'],label:entity['label'],title:entity['title']}];
	ret = dbOpr.insert_sync(fileName_meta, 'TBL_meta_EntityDefine', insertEntitys);
    if('error' in ret){
        throw ret;
    }
	
	// 插入字段元数据定义
	var insertFields=[];
	for(var i in entity['fields']){
		insertFields.push({
			eName:entity['name'],
			name:entity['fields'][i]['name'],
			label:entity['fields'][i]['label'],
			title:entity['fields'][i]['title'],
		});
	}
	ret = dbOpr.insert_sync(fileName_meta, 'TBL_meta_EntityFieldDefine', insertFields);
    if('error' in ret){
        throw ret;
    }
}










// 从元数据库中读取所有字段定义，返回数组
var allFields=function () {
    var ret = dbOpr.exec_sync(fileName_db, 'SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine');
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
    if('error' in ret){
        throw ret;
    }
    return ret;
}

// 从元数据库中根据字段ID查找对应的字段定义
var fieldByID=function (id) {
    var ret = dbOpr.exec_sync(fileName_db, "SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine WHERE ID='" + id + "'");
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
    if ((entity['name'] == null) || entity['name'] == '') {
        return false;
    }
    if ((entity['label'] == null) || entity['label'] == '') {
        return false;
    }
	for(var i in entity['fields']){
		if (checkFieldFmt(entity['fields'][i]) == false){
			return false;
		}
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
    if ((field['name'] == null) || field['name'] == '') {
        return false;
    }
    if ((field['label'] == null) || field['label'] == '') {
        return false;
    }
    if ((field['type'] == null) || field['type'] == '') {
        return false;
    }
    return true;
}

module.exports={
	allEntityName,
	allCompleteEntityMetaData,
	completeEntityMetaData,
	newEntity,
};

