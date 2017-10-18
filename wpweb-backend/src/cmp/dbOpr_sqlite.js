/*
sqlite的操作

异常处理：回调函数处理，因为try/catch无法捕获异步调用

 */
var sqlite3 = require('sqlite3');
var assert = require('assert');

/*
从指定数据库中读取指定表的所有数据
handle=function(err, allRecords){}
*/
var queryAll=function(fileName, sqlStr, handle){
	assert(typeof(handle)=='function');
    assert((fileName != null) && (fileName != ''));
    assert((sqlStr != null) && (sqlStr != ''));
	var db =new sqlite3.Database(fileName);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
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
var execBatch=function(fileName, sqlArr, handle){
	assert(typeof(handle)=='function');
    assert(sqlArr instanceof Array);
    assert(sqlArr.length > 0);
    assert((fileName != null) && (fileName != ''));
	var db =new sqlite3.Database(fileName);
	// serialize可保证回调函数中的db.xxx操作顺序执行，但是不保证回调函数中其他代码顺序执行！！！！
	db.serialize(function() {
		var sqlStr = "";
		for(var i in sqlArr){
			sqlStr += sqlArr[i] + ";";
		}
		db.exec(sqlStr, function(err){
			handle(err);
		});
	});
	db.close();
}

module.exports = {
	queryAll,
    execBatch,
}
