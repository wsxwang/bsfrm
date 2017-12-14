var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity'));
var base = require(path.join(__dirname, '../src/cmp/base'));

/*
webservice:
定制实体的访问路由
*/

// options
router.options('/', function (req,res,next) {
	base.logger4js_api.trace("[OPTIONS %s%s]",req.baseUrl, req.path);
    next();
})

// 获取所有实体的完整元数据（包含字段定义）
router.get('/',function(req, res, next) {
	base.logger4js_api.trace("[GET %s%s]",req.baseUrl, req.path);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allCompleteEntityMetaData();
		base.logger4js_api.info("[GET %s%s]%d", req.baseUrl, req.path, ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s]%o", req.baseUrl, req.path, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 获取所有实体定义的名称
router.get('/name',function(req, res, next) {
	base.logger4js_api.trace("[GET %s%s]",req.baseUrl, req.path);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allEntityName();
		base.logger4js_api.info("[GET %s%s]%d",req.baseUrl, req.path, ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s]%o",req.baseUrl, req.path, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 获取指定实体（根据name）的完整元数据（包含字段定义）
router.get('/:name', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s)]",req.baseUrl, req.path, req.params.name);
	if(req.params.name == 'name'){
		next();
	}
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.completeEntityMetaData(req.params.name);
		base.logger4js_api.info("[GET %s%s(%s)]OK",req.baseUrl, req.path, req.params.name);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s)]%o",req.baseUrl, req.path, req.params.name, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 修改一批实体定义，若name字段不存在则新建，参数是[{name:xxx,...},{}...]
router.put('/', function (req,res,next) {
	base.logger4js_api.trace("[PUT %s%s(%d)]",req.baseUrl, req.path, req.body.length);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateEntitys(req.body);
		base.logger4js_api.info("[PUT %s%s(%d)]OK",req.baseUrl, req.path, req.body.length);
        res.status(201).json({message:"modify success"});
    }catch (e){
		base.logger4js_api.error("[PUT %s%s(%d)]fail:%o",req.baseUrl, req.path, req.body.length, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 删除一批实体定义，参数是需要删除的实体名用逗号分割：xxx,xxx,...
router.delete('/:names', function (req,res,next) {
	base.logger4js_api.trace("[DEL %s%s(%s)]",req.baseUrl, req.path, req.params.names);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.delEntitys(req.params.names);
		base.logger4js_api.info("[DEL %s%s(%s)]OK",req.baseUrl, req.path, req.params.names);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[DEL %s%s(%s)]%o",req.baseUrl, req.path, req.params.names, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

module.exports = router;
