/*
自定义实体的api，涉及到两张元数据表：TBL_meta_EntityDefine，TBL_meta_EntityFieldDefine
-----------------------------
TBL_meta_EntityDefine:实体元数据定义
    ID:唯一标识，必填
    label:显示名称，必填
JSON格式：{
	ID:'xxx',
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
数据表命名：TBL_Entity_EID
-----------------------------
异常处理：抛出
*/
 var assert=require('assert');
 var fs=require("fs");
 var path = require('path');
 var sqlite3=require('sqlite3');

const fileName_db = path.join(__dirname, '../../public/db/TBL_meta_data.db')
const sqlCreateEntity = "CREATE TABLE IF NOT EXISTS TBL_meta_EntityDefine (ID varchar2(255), label varchar2(255))";
const sqlCreateFields = "CREATE TABLE IF NOT EXISTS TBL_meta_EntityFieldDefine (EID varchar2(255), ID varchar2(255), name varchar2(255), label varchar2(255), type varchar2(255), constraints varchar2(255))";

/*
从持久化存储中读取实体元数据定义，不包含字段定义
handle=function(allRecords){}
*/
var metaReadAllEntityFromStore=function(handle){
	assert(typeof(handle)=='function');
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);	
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);
		
		sqlStr = "SELECT ID,label from TBL_meta_EntityDefine";
		db.all(sqlStr, function(err, rows) {
			if(err!=null){
				throw err;
			}
			allRecords = rows;
		});
		
		sqlStr = "SELECT EID,ID,name,label,type,constraints from TBL_meta_EntityFieldDefine";
		db.all(sqlStr, function(err, rows){
			if(err!=null){
				throw err;
			}
			for(var j in rows){
				for(var i in allRecords){
					if(allRecords[i].ID == rows[j].EID){
						if(allRecords[i]['fields']==null){allRecords[i]['fields']=[];}
						allRecords[i]['fields'].push(rows[j]);
						break;
					}
				}
			}
			handle(null, allRecords);
		});
	});
	db.close();
};







/*
从持久化存储中读取所有元数据记录，调用handle函数处理
handle=function(allRecords){}
*/
var metaReadAllFromStore=function (handle) {
	assert(typeof(handle)=='function');
	var allRecords = [];
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);
		
		sqlStr = "SELECT ID,label from TBL_meta_EntityDefine";
		db.all(sqlStr, function(err, rows) {
			if(err!=null){
				throw err;
			}
			allRecords = rows;
		});
		
		sqlStr = "SELECT EID,ID,name,label,type,constraints from TBL_meta_EntityFieldDefine";
		db.all(sqlStr, function(err, rows){
			if(err!=null){
				throw err;
			}
			for(var j in rows){
				for(var i in allRecords){
					if(allRecords[i].ID == rows[j].EID){
						if(allRecords[i]['fields']==null){allRecords[i]['fields']=[];}
						allRecords[i]['fields'].push(rows[j]);
						break;
					}
				}
			}
			handle(null, allRecords);
		});
	});
	db.close();
};

/*
从持久化存储中查找一条元数据记录
handle=function(foundItem){}
*/
var metaReadOneFromStore=function(id, handle){
	assert(typeof(handle)=='function');
	var foundItem = null;
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);
		
		sqlStr = "SELECT ID,label FROM TBL_meta_EntityDefine WHERE ID='" + id + "'";
		db.all(sqlStr, function(err, rows) {
			if(err!=null){
				throw err;
			}
			foundItem=rows[0];
		});
		
		sqlStr = "SELECT EID,ID,name,label,type,constraints FROM TBL_meta_EntityFieldDefine WHERE EID='" + id +"'";
		db.all(sqlStr, function(err, rows){
			if(err!=null){
				throw err;
			}
			if(foundItem != null){
				for(var j in rows){
					if(foundItem.ID == rows[j].EID){
						if(foundItem['fields']==null){foundItem['fields']=[];}
						foundItem['fields'].push(rows[j]);
					}
				}
			}
			handle(null, foundItem);
		});
	});
	db.close();
};

/*
向持久化存储中更新一条元数据记录，若ID不存在则不做操作
*/
var metaUpdateToStore=function(record){
	if (metaIsValidRecord(record) == false){
		throw new Error('format error:');
	}
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);
		
		db.run("UPDATE TBL_meta_EntityDefine SET label=? WHERE ID='?'", record['label'], record['ID']);
		db.run("DELETE FROM TBL_meta_EntityFieldDefine WHERE EID='?'", record['ID']);
		sqlStr = "";
		for(var i in record['fields']){
			sqlStr += "INSERT INTO TBL_meta_EntityFieldDefine (EID,ID,name,label,type,constraints) VALUES('"
				+ record['ID'] + "','"
				+ record['fields'][i]['ID'] + "','"
				+ record['fields'][i]['name'] + "','"
				+ record['fields'][i]['label'] + "','"
				+ record['fields'][i]['type'] + "','"
				+ record['fields'][i]['constraints'] + "');"
		}
		db.exec(sqlStr);
	});
	db.close();
}

/*
向持久化存储中插入一条元数据记录，若ID存在则抛出异常
*/
var metaAddToStore=function(record){
	if (metaIsValidRecord(record) == false){
		throw new Error('format error:');
	}
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);

		sqlStr = "SELECT ID,label FROM TBL_meta_EntityDefine WHERE ID='" + record['ID'] + "'";
		db.each(sqlStr, function(err, row) {
			if(err!=null){
				throw err;
			}
			throw new Error('record already exists!');
		});
		
		db.run("INSERT INTO TBL_meta_EntityDefine (ID, label) VALUES('?','?')", record['ID'], record['label']);
		sqlStr = "";
		for(var i in record['fields']){
			sqlStr += "INSERT INTO TBL_meta_EntityFieldDefine (EID,ID,name,label,type,constraints) values('"
				+ record['ID'] + "','"
				+ record['fields'][i]['ID'] + "','"
				+ record['fields'][i]['name'] + "','"
				+ record['fields'][i]['label'] + "','"
				+ record['fields'][i]['type'] + "','"
				+ record['fields'][i]['constraints'] + "');"
		}
		db.exec(sqlStr);
	});
	db.close();
}

/*
从持久化存储中删除一条元数据记录（根据id），若id不存在不做任何事
*/
var metaDelFromStore=function (id) {
	var sqlStr = "";
	var db =new sqlite3.Database(fileName_db);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		sqlStr = sqlCreateEntity+";"+sqlCreateFields;
		db.exec(sqlStr);

//		db.run("DELETE from TBL_meta_EntityDefine where ID='?'", id);
		db.run("DELETE FROM TBL_meta_EntityFieldDefine WHERE EID='?'", id);
	});
	db.close();
}

/*
判断记录（json格式）是否格式合法
不检测ID是否重复
*/
var metaIsValidRecord=function (record) {
    if (record == null) {
        return false;
    }
    if ((record['ID'] == null) || record['ID'] == '') {
        return false;
    }
    if ((record['label'] == null) || record['label'] == '') {
        return false;
    }
	// check fields...
    return true;
}

var indexInEntity = function (records, id) {
    for(var i=0; i < records.length; i ++){
        if (records[i]['ID'] == id){
            return i;
        }
    }
    return -1;
}

module.exports={
    metaReadAllFromStore,
	metaReadOneFromStore,
    metaUpdateToStore,
	metaAddToStore,
    metaDelFromStore,
    metaIsValidRecord,
};

