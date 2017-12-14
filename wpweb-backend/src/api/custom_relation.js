/*
自定义关系的api，涉及到数据表TBL_relation，在数据库文件custom_data中
字段：
    ID1:实体1ID
    ID2:实体2ID
    label:显示名称
注意1：关系是有方向的，(ID1,ID2,XXX)和(ID2,ID1,XXX)是两条关系
注意2：(ID1,ID2,方向)唯一确定一条关系
全部是同步调用，错误处理采用异常抛出方式
*/
var assert=require('assert');
var path = require('path');
var dbOpr=require('../cmp/dbOpr_sqlite');
var base=require('../cmp/base');

const fileName_data = path.join(__dirname, '../../public/db/custom_data.db')

// 返回所有数据，返回：[{id1:'...',id2:'...',label:'...'},{},...]
var allRelations=function(){
	base.logger4js_api.trace("[allRelations()]");
	var sqlStr = "";
	
	// 在数据文件中查找数据
	sqlStr = "SELECT * FROM TBL_relation";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js_api.trace("[allRelations()]%d records found", data_ret.length);
	return data_ret;
};

// 根据一个id查找包含此id的所有关系，返回：[{id1:'...',id2:'...',label:'...'},{},...]
var relationByID=function(id){
	base.logger4js_api.trace("[relationByID(%o)]", id);
	var sqlStr = "";

	// 在数据文件中查找数据
	sqlStr = "SELECT * FROM TBL_relation WHERE id1='"+ id +"' OR id2='" + id + "'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js_api.trace("[relationByID(%o)]record found", id);
	return data_ret;
};

// 根据id删除记录
// idArray：字符串，形如：id1,id1:,:id2,id1:id2,...
// 	id1-删除所有包含该id的所有记录
//	id1:-删除前序包含该id的所有记录
//	:id2-删除后序包含该id的所有记录
//	id1:id2-按顺序删除一条记录
var delRelations=function(idArray){
	base.logger4js_api.trace("[delRelations(%o)]", idArray);
	var sqlStr = "";
	var sqlArray = [];
	var ret = [];
	
	var arr = idArray.split(",");
	for (var i in arr){
		sqlStr = "DELETE FROM TBL_relation WHERE ";
		var ids = arr[i].split(":");
		if(ids.length == 1){
			sqlStr += "id1 ='" + ids[0] + "' OR id2='" + ids[0] + "'";
			sqlArray.push(sqlStr);
			continue;
		}
		if(ids[0] != ''){
			sqlStr += "id1 = '" + ids[0] + "'";
		}
		if((ids[0] != '') && (ids[1] != '')){
			sqlStr += ' AND ';
		}
		if(ids[1] != ''){
			sqlStr += "id2 = '" + ids[1] + "'";
		}
		sqlArray.push(sqlStr);
	}	
	ret = dbOpr.execBatch_sync(fileName_data, sqlArray);
	if((ret instanceof Array)==false){
		throw ret;
	}
	base.logger4js_api.trace("[delRelations(%o)]success",idArray);
}

// 更新或插入一批记录
// records：[{id1:'...',id2:'...',label:'...'},{},...]
// 若id1、id2的顺序对在表中不存在则新增，否则更新label字段
var updateRelations=function(records){
	base.logger4js_api.trace("[updateRelations(%o)]", records.length);
	var sqlStr = "";

	// 查找哪些记录是存在的（需要更新）
	records.forEach(function(v){sqlStr += "(id1='" + v['id1'] + "' AND id2='" + v['id2'] + "') OR"});
	sqlStr = sqlStr.substr(0, sqlStr.length-3);
	sqlStr = "SELECT id1,id2 from TBL_relation WHERE " + sqlStr;
	var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js_api.trace("[updateRelations(%o)]%d records need update:%o", records.length, data_ret.length, data_ret);

	for(var i in records){
		if(data_ret.findIndex(function(v){return (records[i]['id1']==v['id1'])&&(records[i]['id2']==v['id2']);}) >= 0){
			// 更新记录
			updateRelation(records[i]);
		}else{
			// 插入新记录
			insertRelation(records[i]);
		}
	}
	
	base.logger4js_api.trace("[updateRelations(%o)]success", records.length);
}

// 更新一条记录（不检测是否存在）
var updateRelation=function(record){
	base.logger4js_api.trace("[updateRelation(%o)]", record);
	var sqlStr = "";
	sqlStr = "UPDATE TBL_relation SET label='" + record['label'] + "' WHERE id1='" + record['id1'] + "' AND id2='" + record['id2'] + "'";
	var ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if(typeof(ret)!='number'){
		throw ret;
	}
	base.logger4js_api.trace("[updateRelation(%o)]succ", record);
}

// 插入新记录（不检测是否重复）
var insertRelation=function(record){
	base.logger4js_api.trace("[insertRelation(%o)]", record);
	var sqlStr = "";
	sqlStr = "INSERT INTO TBL_relation (id1,id2,label) VALUES ('" + record['id1'] + "','" + record['id2'] + "','" + record['label'] + "')";
	var ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if(typeof(ret)!='number'){
		throw ret;
	}
	base.logger4js_api.trace("[insertRelation(%o)]succ", record);
}

module.exports={
	allRelations,
	relationByID,
	delRelations,
	updateRelations,
};


