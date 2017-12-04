/*
定制实体的数据访问api

所有定制的实体，其数据都存储于sqlite数据文件/public/db/custom_data.db中
实体数据存于单表中，起名为：TBL_DATA_xxx，xxx为实体元数据中定义的名称（非显示名称）

全部是同步调用，错误处理采用异常抛出方式
*/
 
var assert=require('assert');
var path = require('path');
var dbOpr=require('../cmp/dbOpr_sqlite');
var base=require('../cmp/base');

const fileName_data = path.join(__dirname, '../../public/db/custom_data.db')

// 在表名为ename的表中返回所有数据，返回：[{},{},...]
var allRecords=function(ename){
	base.logger4js.trace("[allRecords(%o)]", ename);
	var sqlStr = "";
	var ret = [];
	
	// 在数据文件中查找数据
	sqlStr = "SELECT * FROM TBL_DATA_"+ename;
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js.trace("[allRecords(%o)]%d records found", ename, data_ret.length);
	return ret;
};

// 在表名为ename的表中根据guid查找一条记录，返回：{}或null
var recordByGuid=function(ename, guid){
	base.logger4js.trace("[recordByGuid(%o,%o)]", ename, guid);
	var sqlStr = "";
	var ret = [];
	
	// 在数据文件中查找数据
	sqlStr = "SELECT * FROM TBL_DATA_"+ename + " WHERE guid='"+ guid +"'";
    var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	if(ret.length == 0){
		base.logger4js.trace("[recordByGuid(%o,%o)]record not found", ename, guid);
		return null;
	}else{
		base.logger4js.trace("[recordByGuid(%o,%o)]record found", ename, guid);
		return ret[0];
	}
};

// 在表名为ename的表中根据guid集合删除记录
// guidArray：字符串，以逗号隔开
var delRecords=function(ename, guidArray){
	base.logger4js.trace("[delRecords(%o,%o)]", ename, guidArray);
	var sqlStr = "";
	var ret = [];
	
	// 在数据文件中删除数据
	sqlStr = "DELETE FROM TBL_DATA_"+ename+" WHERE guid in ('" + guidArray.replace(/,/g,"','") + "'";
	ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if(ret != 0){
		throw ret;
	}
	base.logger4js.trace("[delRecords(%o,%o)]success", ename, guidArray);
}

// 在表名为ename的表中根据guid更新一批记录
var updateRecords=function(ename, records){
	base.logger4js.trace("[updateRecords(%o,%o)]", ename, records.length);
	var sqlStr = "";

	// 查找哪些记录是存在的（需要更新）
	records.forEach(function(v){sqlStr += "'" + v['guid'] + "',"});
	sqlStr = sqlStr.substr(0, sqlStr.length-1);
	sqlStr = "SELECT guid from TBL_DATA_" + ename + " WHERE guid in (" + sqlStr + ")";
	var data_ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if ('error' in data_ret){throw data_ret;}
	base.logger4js.trace("[updateRecords(%o,%o)]%d records need update:%o", ename, records.length, data_ret.length, data_ret);

	for(var i in records){
		if(data_ret.findIndex(function(v){return records[i]['guid']==v;}) >= 0){
			// 更新记录
			updateRecord(ename, records[i]);
		}else{
			// 插入新记录
			insertRecord(ename, records[i]);
		}
	}
	
	base.logger4js.trace("[updateRecords(%o,%o)]success", ename, records.length);
}

// 在表名为ename的表中根据guid更新一条记录（不检测guid是否存在）
var updateRecord=function(ename, record){
	base.logger4js.trace("[updateRecord(%o,%o)]", ename, record['guid']);
	var sqlStr = "";
	sqlStr = "UPDATE TBL_DATA_" + ename + " SET";
	for(var i in record){
		sqlStr += i + "='" + record[i] + "',";
	};
	sqlStr = sqlStr.substr(0, sqlStr.length-1);
	sqlStr += " WHERE guid='"+record['guid']+"'";
	var ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if(ret != 0){
		throw ret;
	}
	base.logger4js.trace("[updateRecord(%o,%o)]succ", ename, record['guid']);
}

// 在表名为ename的表中插入新记录（不检测guid是否重复）
var insertRecord=function(ename, record){
	base.logger4js.trace("[insertRecord(%o,%o)]", ename, record['guid']);
	var sqlStr = "";
	sqlStr = "INSERT INTO TBL_DATA_" + ename + " (";
	for(var i in record){
		sqlStr += i +",";
	};
	sqlStr = sqlStr.substr(0, sqlStr.length-1);
	sqlStr += ") VALUES (";
	for(var i in record){
		sqlStr += "'" + record[i] + "',";
	};
	sqlStr = sqlStr.substr(0, sqlStr.length-1);
	sqlStr += ")";
	var ret = dbOpr.exec_sync(fileName_data, sqlStr);
	if(ret != 0){
		throw ret;
	}
	base.logger4js.trace("[insertRecord(%o,%o)]succ", ename, record['guid']);
}

module.exports={
	allRecords,
	recordByGuid,
	delRecords,
	updateRecords,
};
