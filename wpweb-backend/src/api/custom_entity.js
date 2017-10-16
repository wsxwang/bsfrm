/*
自定义实体的api，涉及到两张元数据表：TBL_meta_EntityDefine，TBL_meta_EntityFieldDefine
TBL_meta_EntityDefine
    ID:唯一标识，必填
    label:显示名称，必填
TBL_meta_EntityFieldDefine
    EID:实体ID，必填
    ID:唯一标识，必填
    label:显示名称，必填
    type:单选：string,number,password，必填
    constraint:多选：unique，required
数据表命名：TBL_Entity_EID
 */

//  从持久化存储中读取所有记录
var readAllFromStore=function () {
	console.log('readAllFromStore');
    return [];
};

// 从持久化存储中查找一条记录
var readOneFromStore=function(id){
	console.log('readOneFromStore' + id);
	return null;
};

// 向持久化存储中更新一条记录，若ID不存在则新增
var UpdateToStore=function(record){
	console.log('UpdateToStore' + record.toString());
}

// 从持久化存储中删除一条记录（根据id）
var delFromStore=function (id) {
	console.log('delFromStore' + id);
}

// 判断记录（json格式）是否格式合法
var isValidRecord=function (record) {
    if (record == null) {
        return false;
    }
    if ((record['ID'] == null) || u['ID'] == '') {
        return false;
    }
    if ((record['label'] == null) || record['label'] == '') {
        return false;
    }
    return true;
}

// 复制对象
var clone=function (o) {
    return JSON.parse(JSON.stringify(o));
}

module.exports={
    readAllFromStore,
	readOneFromStore,
    UpdateToStore,
    delFromStore,
    isValidRecord,
};

