var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_relation'));
var base = require(path.join(__dirname, '../src/cmp/base'));

/*
webservice:
定制关系的访问路由
*/

// options
router.options('/', function (req,res,next) {
	base.logger4js_api.trace("[OPTIONS %s%s]",req.baseUrl, req.path);
    next();
})

// 获取所有关系记录，返回：[{id1:'...',ename1:'...',id2:'...',ename2:'...',label:'...'},{},...]
router.get('/',function(req, res, next) {
	base.logger4js_api.trace("[GET %s%s]",req.baseUrl, req.path);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allRelations();
		base.logger4js_api.info("[GET %s%s]%d", req.baseUrl, req.path, ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s]%o", req.baseUrl, req.path, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 根据一个id查找包含此id的所有关系，返回：[{id1:'...',ename1:'...',id2:'...',ename2:'...',label:'...'},{},...]
router.get('/:id', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s)]",req.baseUrl, req.path, req.params.id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.relationByID(req.params.id);
		base.logger4js_api.info("[GET %s%s(%s)]OK",req.baseUrl, req.path, req.params.id);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s)]%o",req.baseUrl, req.path, req.params.id, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 更新或插入一批记录，参数是[{id1:'...',ename1:'...',id2:'...',ename2:'...',label:'...'},{},...]
// 若id1、id2的顺序对在表中不存在则新增，否则更新label字段
// 若id1、id2有任意一个为空，则跳过该记录
router.put('/', function (req,res,next) {
	base.logger4js_api.trace("[PUT %s%s(%d)]",req.baseUrl, req.path, req.body.length);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateRelations(req.body);
		base.logger4js_api.info("[PUT %s%s(%d)]OK",req.baseUrl, req.path, req.body.length);
        res.status(201).json({message:"modify success"});
    }catch (e){
		base.logger4js_api.error("[PUT %s%s(%d)]fail:%o",req.baseUrl, req.path, req.body.length, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 根据id删除记录，参数是字符串，形如：id1,id1:,:id2,id1:id2,...
router.delete('/:ids', function (req,res,next) {
	base.logger4js_api.trace("[DEL %s%s(%s)]",req.baseUrl, req.path, req.params.ids);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.delRelations(req.params.ids);
		base.logger4js_api.info("[DEL %s%s(%s)]OK",req.baseUrl, req.path, req.params.ids);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[DEL %s%s(%s)]%o",req.baseUrl, req.path, req.params.ids, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

module.exports = router;
