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
*/

var assert=require('assert');
var fs=require("fs");
var path = require('path');
var sqlite3=require('sqlite3');
var dbOpr=require('../cmp/dbOpr_sqlite');
var base=require('../cmp/base');

const fileName_meta = path.join(__dirname, '../../public/db/meta_data.db')
const fileName_data = path.join(__dirname, '../../public/db/custom_data.db')

// 返回所有实体定义（包含字段），返回数组
var allCompleteEntityMetaData=function () {
	base.logger4js.trace("[allCompleteEntityMetaData()]");
	var sqlStr = "";
	var ret = [];
	
	var names = allEntityName();	
	base.logger4js.trace("[allCompleteEntityMetaData()]%d entity names found", names.length);
	for(var i in names){
		var metadata = completeEntityMetaData(names[i]);
		if(metadata['name']!= null){
			ret.push(metadata);
		}
	}

	base.logger4js.trace("[allCompleteEntityMetaData()]%d entity found success", ret.length);
	return ret;
}

// 返回所有实体名(name)，返回数组
var allEntityName=function(){
	base.logger4js.trace("[allEntityName()]");
	var sqlStr = "";
	var ret = [];
	
	// 在数据文件中查找实体的数据表
	sqlStr = "SELECT tbl_name FROM SQLITE_MASTER WHERE tbl_name like 'TBL_DATA_%'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js.trace("[allEntityName()]%d entity found", data_ret.length);
	if (data_ret.length == 0) return ret;	// 实体不存在
	
	for(var i in data_ret){
		ret.push(data_ret[i]['tbl_name'].substring(9));
	}

	base.logger4js.trace("[allEntityName()]%d entity names success", ret.length);
	return ret;
}

// 根据实体name字段获取该实体的完整元数据（包括字段定义）
var completeEntityMetaData=function(name){
	base.logger4js.trace("[completeEntityMetaData()]%s",name);
	var sqlStr = "";
	var ret = {};
	
	// 在数据文件中查找是否存在该实体的数据表
	sqlStr = "SELECT tbl_name FROM SQLITE_MASTER WHERE tbl_name = 'TBL_DATA_" + name + "'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	if (data_ret.length != 1) return ret;	// 实体不存在
	ret['name']= name;
	base.logger4js.trace("[completeEntityMetaData()]%s, data table found",name);

	// 在元数据表中查找实体的定义
	sqlStr = "SELECT name,label,title FROM TBL_meta_EntityDefine WHERE name='" + name + "'";
    meta_ret = dbOpr.exec_sync(fileName_meta, sqlStr);
	if ('error' in meta_ret){throw meta_ret;}
	if (meta_ret.length == 0){
		ret['label']= name;
	}
	else{
		ret['label']= meta_ret[0]['label'];
		ret['title']= meta_ret[0]['title'];
	}
	base.logger4js.trace("[completeEntityMetaData()]%s, meta data found",name);

	// 查找该表的所有字段
	sqlStr = "PRAGMA TABLE_INFO('TBL_DATA_" + name + "')";
    data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js.trace("[completeEntityMetaData()]%s, data table %d columns found",name, data_ret.length);
	
	// 在元数据表中查找字段的定义
	sqlStr = "SELECT eName,name,label,title FROM TBL_meta_EntityFieldDefine WHERE eName='" + name + "'";
    meta_ret = dbOpr.exec_sync(fileName_meta, sqlStr);
	if ('error' in meta_ret){throw meta_ret;}
	base.logger4js.trace("[completeEntityMetaData()]%s, meta data %d fields found",name, meta_ret.length);

	// 两个返回值join，以实际的数据表为基准
	var fields=[];
	for(var i in data_ret){
		if(data_ret[i]['name']=='guid'){continue;}
		var field = {};
		field['name']= data_ret[i]['name'];
		field['type']= data_ret[i]['type'];
		for(var j in meta_ret){
			if(meta_ret[j]['name']==data_ret[i]['name']){
				field['label']= meta_ret[j]['label'];
				field['title']= meta_ret[j]['title'];
			}
		}
		if((field['label']=='')||(field['label']==null)){
			field['label']=field['name'];
		}
		fields.push(field);
	}
	ret['fields']= fields;
	base.logger4js.trace("[completeEntityMetaData()]%s, found success",name);
	return ret;
}

// 更新一批实体定义，参数是数组，对于其中每一个元素，将检查实体定义是否存在，若不存在则新建，否则只更新
var updateEntitys=function (entitys) {
	base.logger4js.trace("[updateEntitys()]%d",entitys.length);
	if((entitys instanceof Array) == false) throw Error('format error');
	if(entitys.length == 0) throw Error('format error');
	
	var names = allEntityName();
	base.logger4js.trace("[updateEntitys()]entity names in db: ", names);
	entitys.forEach(function(item, index, arr){
		base.logger4js.trace("[updateEntitys()]insert or update entity %s", item['name']);
		if(names.findIndex(function(v, i, a){if(v == item['name']){return true;}}) == -1){
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
	base.logger4js.trace("[newEntity()]%s", entity['name']);
	var sqlStr = '';
	var ret = null;
	
	if(checkEntityFmt(entity) == false){
        throw Error('format error');
	}
	
	// 创建数据表
	sqlStr="CREATE TABLE TBL_DATA_" + entity['name']+ "(guid varchar2(255)";
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
	base.logger4js.trace("[newEntity()]%s, create data table success", entity['name']);

	// 插入实体元数据定义
	var insertEntitys=[{name:entity['name'],label:entity['label'],title:entity['title']}];
	ret = dbOpr.insert_sync(fileName_meta, 'TBL_meta_EntityDefine', insertEntitys);
    if('error' in ret){
        throw ret;
    }
	base.logger4js.trace("[newEntity()]%s, create meta data success", entity['name']);
	
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
	base.logger4js.trace("[newEntity()]%s, create %d fields meta data success", entity['name'], insertFields.length);
}

// 更新一个实体定义，实体定义本身仅需更新元数据信息，字段信息的变更需要更改数据表
// 不支持字段改名，不支持字段删除，不支持字段类型修改
var updateEntity=function(entity) {
	base.logger4js.trace("[updateEntity()]%s", entity['name']);
	var sqlStr = '';
	var ret = null;

	if(checkEntityFmt(entity) == false){
        throw Error('format error');
	}
	
	// 查找库中的旧定义
	var oldEntity = completeEntityMetaData(entity['name']);
	assert(oldEntity != null);
	base.logger4js.trace("[updateEntity()]%s, old defination found", entity['name']);
	
	if((oldEntity['label']!=entity['label'])||(oldEntity['title']!=entity['title'])){
		// 修改元数据定义
		sqlStr="UPDATE TBL_meta_EntityDefine SET label='" + entity['label']+ "',title='" + entity['title']+ "' WHERE name='" + entity['name']+ "'";
		ret = dbOpr.exec_sync(fileName_meta, sqlStr);
		if(ret != 0){
			throw ret;
		}
		base.logger4js.trace("[updateEntity()]%s, update meta data success", entity['name']);
	}else{
		base.logger4js.trace("[updateEntity()]%s, entity(without fields) meta data same, do not update", entity['name']);
	}
	
	if(true){//... 字段是否需要修改未实现
		// 修改字段定义		
		// 修改字段信息的元数据定义：先删后改
		sqlStr="DELETE FROM TBL_meta_EntityFieldDefine WHERE eName='" + entity['name']+ "'";
		ret = dbOpr.exec_sync(fileName_meta, sqlStr);
		if(ret != 0){
			throw ret;
		}
		base.logger4js.trace("[updateEntity()]%s, delete column meta data success", entity['name']);
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
		base.logger4js.trace("[updateEntity()]%s, create %d fields meta data success", entity['name'], insertFields.length);

		// 逐个字段
		for(var i in entity['fields']){
			var oldIndex = oldEntity['fields'].findIndex(function(v){return entity['fields'][i]['name']== v['name'];});
			if(oldIndex == -1){
				// 该字段在旧定义中不存在
				// 增加字段
				sqlStr="ALTER TABLE TBL_DATA_" + entity['name']+ ' ADD ' + entity['fields'][i]['name']+ ' ' + entity['fields'][i]['type'];
				ret = dbOpr.exec_sync(fileName_data, sqlStr);
				if(ret != 0){
					throw ret;
				}
				base.logger4js.trace("[updateEntity()]%s, add column %s success", entity['name'], entity['fields'][i]['name']);
			}else{
				var sqlArray = [];
				// 该字段在旧定义中存在，判断类型是否需要修改
				if(oldEntity['fields'][oldIndex]['type']!= entity['fields'][i]['type']){
					// 修改数据表的字段类型，暂不支持！！！
					throw Error("filed(data table column) type modify not supported");
					sqlStr="ALTER TABLE TBL_DATA_" + entity['name']+ ' ALTER COLUMN ' + entity['fields'][i]['name']+ ' ' + entity['fields'][i]['type'];
					ret = dbOpr.exec_sync(fileName_data, sqlStr);
					if(ret != 0){
						throw ret;
					}
					base.logger4js.trace("[updateEntity()]%s, modify column %s type success", entity['name'], entity['fields'][i]['name']);
				}else{
					base.logger4js.trace("[updateEntity()]%s, column %s type do not need modify", entity['name'], entity['fields'][i]['name']);
				}
			}
		}
		for(var i in oldEntity['fields']){
			if(entity['fields'].findIndex(function(v){return oldEntity['fields'][i]['name']== v['name'];}) == -1){
				// 删除字段
				// 删除数据表的字段，暂不支持！！！
				throw Error("filed(data table column) delete not supported");
				sqlStr="ALTER TABLE TBL_DATA_" + entity['name']+ ' DROP COLUMN ' + oldEntity['fields'][i]['name'];
				ret = dbOpr.exec_sync(fileName_data, sqlStr);
				if(ret != 0){
					throw ret;
				}
				base.logger4js.trace("[updateEntity()]%s, delete column %s success", entity['name'], entity['fields'][i]['name']);
			}
		}
		base.logger4js.trace("[updateEntity()]%s, modify %d column data success", entity['name'], entity['fields'].length);
	}
	else{
		base.logger4js.trace("[updateEntity()]%s, fields configure do not need modify", entity['name']);
	}
}

// 根据名称删除实体定义，顺序：1、删除数据；2、删除字段定义；3、删除实体定义
var delEntity=function(names){
	base.logger4js.trace("[delEntity()]%s", names);
	throw Error("not implemented");
}

/*
判断实体定义格式是否合法
不检测ID是否重复
*/
var checkEntityFmt=function (entity) {
    if (entity == null) {
        return false;
    }
    if ((entity['name']== null) || entity['name']== '') {
        return false;
    }
    if ((entity['label']== null) || entity['label']== '') {
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
    if ((field['name']== null) || field['name']== '') {
        return false;
    }
    if ((field['label']== null) || field['label']== '') {
        return false;
    }
    if ((field['type']== null) || field['type']== '') {
        return false;
    }
    return true;
}

module.exports={
	allEntityName,
	allCompleteEntityMetaData,
	completeEntityMetaData,
	updateEntitys,
	delEntity,
};

