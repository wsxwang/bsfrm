/*
定制实体的数据访问api

所有定制的实体，其数据都存储于sqlite数据文件/public/db/custom_data.db中
实体数据存于单表中，起名为：TBL_DATA_xxx，xxx为实体元数据中定义的名称（非显示名称）

同步函数的错误处理采用异常抛出方式
*/
 
var assert=require('assert');
var fs=require("fs");
var path = require('path');
var sqlite3=require('sqlite3');
var dbOpr=require('../cmp/dbOpr_sqlite')

const fileName_db = path.join(__dirname, '../../public/db/custom_data.db')

// 在表名为ename的表中返回所有数据，返回：[{},{},...]
var allRecords=function(ename){
	console.log("allRecords:%o", ename);
	
	return [
		{
			guid:'id1',
			col1:'1.1',
			col2:'1.2',
		},
		{
			guid:'id2',
			col1:'2.1',
			col2:'2.2',
		},
		{
			guid:'id3',
			col1:'3.1',
			col2:'3.2',
		},
	];
	
	
	
	return [];
};

// 在表名为ename的表中根据guid查找一条记录，返回：{}或null
var recordByGuid=function(ename, guid){
	console.log("recordByGuid:%o,%o", ename, guid);
		return	{
			guid:'id2',
			col1:'2.1',
			col2:'2.2',
		};

	
	return null;
};

// 在表名为ename的表中根据guid数组删除记录
var delRecords=function(ename, guidArray){
	console.log("delRecords:%o,%o", ename, guidArray);
}

// 在表名为ename的表中插入一批记录
var insertRecords=function(ename, records){
	console.log("insertRecords:%o,%o", ename, records);
}

// 在表名为ename的表中根据guid更新一批记录
var updateRecords=function(ename, records){
	console.log("updateRecords:%o,%o", ename, records);
}

module.exports={
	allRecords,
	recordByGuid,
	delRecords,
	insertRecords,
	updateRecords,
};
