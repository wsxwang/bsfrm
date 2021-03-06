/*
sqlite的操作

异常处理：
	对于异步调用，采用回调函数处理，因为try/catch无法捕获异步调用。
	对于同步调用，错误信息在返回值中：{error:{}}
 */
var sqlite3 = require('sqlite3');
var sqliteSync = require('sqlite-sync');
var assert = require('assert');

var base = require('./base');

/*
从指定数据库中读取指定表的所有数据
handle=function(err, allRecords){}
*/
var queryAll=function(fileName, sqlStr, handle){
	base.logger4js_db.debug('queryAll(%s,%s)',fileName, sqlStr);
	assert(typeof(handle)=='function');
    assert((fileName != null) && (fileName != ''));
    assert((sqlStr != null) && (sqlStr != ''));
	var db =new sqlite3.Database(fileName);
	db.serialize(function() {
		db.all(sqlStr, function(err, rows) {
			handle(err, rows);
		});
	});
	db.close();
};

/*
在指定数据库中执行多个语句
handle=function(err){}，执行后调用
*/
var execBatch=function(fileName, sqlArray, handle){
	base.logger4js_db.debug('execBatch(%s,%o)',fileName, sqlArray);
	assert(typeof(handle)=='function');
    assert(sqlArray instanceof Array);
    assert(sqlArray.length > 0);
    assert((fileName != null) && (fileName != ''));
	var db =new sqlite3.Database(fileName);
	db.serialize(function() {
		var sqlStr = "";
		for(var i in sqlArray){
			sqlStr += sqlArray[i] + ";";
		}
		db.exec(sqlStr, function(err){
			handle(err);
		});
	});
	db.close();
}

////////////////////////////////////////
/*
同步调用
在指定数据库中执行一个sql语句
返回值依赖于sql执行结果，若发生错误，返回一个错误对象
*/
var exec_sync=function(fileName, sqlStr){
	base.logger4js_db.debug('exec_sync(%s,%s)',fileName, sqlStr);
    assert((fileName != null) && (fileName != ''));
    assert((sqlStr != null) && (sqlStr != ''));

    sqliteSync.connect(fileName);
    var ret = sqliteSync.run(sqlStr);
    sqliteSync.close();
    return ret;
}

/*
同步调用
在指定数据库中执行一批sql语句
语句一条一条执行，若失败则终止并返回错误信息，若成功则将返回值作为要给数组返回
*/
var execBatch_sync=function(fileName, sqlArray){
	base.logger4js_db.debug('execBatch_sync(%s,%o)',fileName, sqlArray);
    assert((fileName != null) && (fileName != ''));
    assert(sqlArray instanceof Array);
    assert(sqlArray.length > 0);

    var ret = [];
    sqliteSync.connect(fileName);
    for(var i in sqlArray){
        var rr = sqliteSync.run(sqlArray[i]);
        if((typeof(rr) == 'object') &&('error' in rr)){
			sqliteSync.close();
            return rr;
        }else{
            ret.push(rr);
        }
    }
    sqliteSync.close();
    return ret;
}

/*
同步调用
在指定数据中向指定表中插入一批数据
records：数组，元素是JSON对象，key与数据库字段一一对应
数据是一条一条插入，若失败则终止并返回错误信息，若成功返回插入的行ID的数组
 */
var insert_sync=function (fileName, tblName, records) {
	base.logger4js_db.debug('insert_sync(%s,%s,%o)',fileName, tblName,records);
    assert((fileName != null) && (fileName != ''));
    assert((tblName != null) && (tblName != ''));
    assert(records instanceof Array);
    assert(records.length > 0);
    var ret = [];
    sqliteSync.connect(fileName);
    for(var i in records){
        var index = sqliteSync.insert(tblName, records[i]);
        if(typeof (index) == 'number') {
            ret.push(index);
        }else{
			sqliteSync.close();
            return index;
        }
    }
    sqliteSync.close();
    return ret;
}

////////////////////////////////////////
/*
同步调用
判断表是否存在
true/false：是否存在
其他：错误信息
 */
var tblExists_sync=function (fileName, tblName) {
    var ret = exec_sync(fileName, "SELECT name FROM SQLITE_MASTER WHERE name='" + tblName+ "'");
    if ('error' in ret){
        return ret;
    }else{
        return (ret.length > 0);
    }
}

module.exports = {
	queryAll,
    execBatch,
    exec_sync,
    execBatch_sync,
    insert_sync,
    tblExists_sync,
}
