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
    constraint:多选（逗号隔开）：unique,required
JSON格式：{
	EID:'xxx',		// api对外不公开
	ID:'xxx',
	name:'xxx',
	label:'xxx',
	type:'xxx',
	constraint:'xxx,xxx',
}
-----------------------------
持久化：采用json对象序列化与反序列化为文件，所有实体及字段序列化为TBL_meta_EntityDefine.json一个文件
-----------------------------
数据表命名：TBL_Entity_EID
 */
 var assert=require('assert');
 var fs=require("fs");
 var path = require('path');
 var sqlite3=require('sqlite3');

//const fileName_entity = path.join(__dirname, '../../public/db/TBL_meta_EntityDefine.json')
const fileName_entity = path.join(__dirname, '../../public/db/TBL_meta_EntityDefine.db')

var readall=function (fileName) {
	var ret = [];
    var str = fs.readFileSync(fileName).toString();
    var record = str.split("\n");
    for (i in record){
        if (record[i].length > 2){
            ret.push(JSON.parse(record[i]));
        }
    }
	return ret;
}

var writeall=function (records, fileName) {
    var s = "";
    for(i in records){
        s += JSON.stringify(records[i]) + "\n";
    }
    fs.writeFileSync(fileName, s);
}





/*
从持久化存储中读取所有元数据记录，调用handle函数处理
handle=function(error, allRecords){}
*/
var metaReadAllFromStore=function (handle) {
	assert(typeof(handle)=='function');
	/*
	var sqlStr = 'SELECT ID,label from TBL_meta_EntityDefine';
	new sqlite3.Database(fileName_entity).all(sqlStr, function(err, res){
		handle(err, res);
	});
	
	*/
	
	
	
	handle(null, readall(c_fileName));
};

/*
从持久化存储中查找一条元数据记录
handle=function(error, foundItem){}
*/
var metaReadOneFromStore=function(id, handle){
	assert(typeof(handle)=='function');
	metaReadAllFromStore(function(err, allEntity){
		if(err != null){
			handle(err);
		}else{
			assert(allEntity != null);
			var index = indexInEntity(allEntity, id);
			if(index >= 0){
				handle(null, allEntity[index]);
			}
			else{
				handle(null, null);
			}
		}
	});
};

/*
向持久化存储中更新一条元数据记录，若ID不存在则新增，若参数不合法则返回false，否则返回true
handle=function(err){}
*/
var metaUpdateToStore=function(record, handle){
	assert(typeof(handle)=='function');
	if (metaIsValidRecord(record) == false){
		handle(new Error('format error:'));
	};
	metaReadAllFromStore(function(err, allEntity){
		if(err != null){
			handle(err);
		}else{
			assert(allEntity != null);
			var index = indexInEntity(allEntity, record['ID']);
			if(index >= 0){
				allEntity[index] = record;
			}
			else{
				allEntity.push(record);
			}
			writeall(allEntity, c_fileName);
			handle(null);
		}
	});
}

/*
从持久化存储中删除一条元数据记录（根据id），若id不存在不做任何事
handle=function(err){}
*/
var metaDelFromStore=function (id, handle) {
	assert(typeof(handle)=='function');
	metaReadAllFromStore(function(err, allEntity){
		if(err!=null){
			handle(err);
		}else{
			assert(allEntity != null);
			var index = indexInEntity(allEntity, id);
			if(index >= 0){
				allEntity.splice(index, 1);
				writeall(allEntity, c_fileName);
			}
			handle(null);
		}
	});
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
    metaDelFromStore,
    metaIsValidRecord,
};

