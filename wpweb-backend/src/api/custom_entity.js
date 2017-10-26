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
	ret['name'] = name;

	// 在元数据表中查找实体的定义
	sqlStr = "SELECT name,label,title FROM TBL_meta_EntityDefine WHERE name='" + name + "'";
    meta_ret = dbOpr.exec_sync(fileName_meta, sqlStr);
	if ('error' in meta_ret){throw meta_ret;}
	if (meta_ret.length == 0){
		ret['label'] = name;
	}
	else{
		ret['label'] = meta_ret[0]['label'];
		ret['title'] = meta_ret[0]['title'];
	}


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
		if((field['label']=='')||(field['label']==null)){
			field['label']=field['name'];
		}
		fields.push(field);
	}
	ret['fields'] = fields;
	return ret;
}

// 更新一批实体定义，参数是数组，对于其中每一个元素，将检查实体定义是否存在，若不存在则新建，否则只更新
var updateEntitys=function (entitys) {
	if((entitys instanceof Array) == false) throw Error('format error');
	if(entitys.length == 0) throw Error('format error');
	
	var names = allEntityName();
	entitys.forEach(function(item, index, arr){
		if(names.findIndex(function(v, i, a){if(v == item['name']) return i;}) == -1){
			// 新增
			newEntity(item);
		}else{
			// 更新
			updateEntity(item);
		}
	});
}

// 新建一个实体定义（包含字段），将创建实体元数据及数据表
var newEntity=function (entity) {
	throw Error("newEntity not implemented");

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

// 更新一个实体定义，实体定义本身仅需更新元数据信息，字段信息的变更需要更改数据表
var updateEntity=function (entity) {
	throw Error("updateEntity not implemented");
	
	// 修改元数据定义
	
	// 检查数据表是否存在
	
	// 逐个字段
	// 修改字段信息的元数据定义
	// 修改数据表的字段名
	// 修改数据表的字段类型
	// 增加字段
	
	// 删除字段
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
	updateEntitys,
};

