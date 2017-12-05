var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity_data'));
var api_meta = require(path.join(__dirname, '../src/api/custom_entity'));
var base = require(path.join(__dirname, '../src/cmp/base'));

/*
webservice: 定制实体数据的访问
所有操作均针对指定的实体（通过实体name）
 */

// options
router.options('/', function (req,res,next) {
	base.logger4js_api.trace("[OPTIONS %s%s]",req.baseUrl, req.path);
    next();
})

// 获取指定实体的所有数据记录，返回数据数组
router.get('/:eName', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s)]",req.baseUrl, req.path, req.params.eName);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allRecords(req.params.eName);
		base.logger4js_api.info("[GET %s%s(%s)]OK",req.baseUrl, req.path, req.params.eName);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s)]%o",req.baseUrl, req.path, req.params.eName, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

// 获取指定实体的指定guid的数据记录，返回{guid:'...',...}或null
router.get('/:eName/:guid', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s,%s)]",req.baseUrl, req.path, req.params.eName, req.params.guid);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.recordByGuid(req.params.eName, req.params.guid);
		base.logger4js_api.info("[GET %s%s(%s,%s)]OK",req.baseUrl, req.path, req.params.eName, req.params.guid);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s,%s)]%o",req.baseUrl, req.path, req.params.eName, req.params.guid, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

// 修改指定实体的一批数据，根据guid进行更新，若guid不存在则新建，参数是[{guid:xxx,...},{}...]
router.put('/:eName', function (req,res,next) {
	base.logger4js_api.trace("[PUT %s%s(%s,%d)]",req.baseUrl, req.path, req.params.eName, req.body.length);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateRecords(req.params.eName, req.body);
		base.logger4js_api.info("[PUT %s%s(%s,%d)]OK",req.baseUrl, req.path, req.params.eName, req.body.length);
        res.status(201).json({message:"modify success"});
    }catch (e){
		base.logger4js_api.error("[PUT %s%s(%s,%d)]fail:%o",req.baseUrl, req.path, req.params.eName, req.body.length, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 删除指定实体的一批数据，参数是需要删除的guid，逗号分割：xxx,xxx,...
router.delete('/:eName/:guids', function (req,res,next) {
	base.logger4js_api.trace("[DEL %s%s(%s,%s)]",req.baseUrl, req.path, req.params.eName, req.params.guids);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.delRecords(req.params.eName, req.params.guids);
		base.logger4js_api.info("[DEL %s%s(%s,%s)]OK",req.baseUrl, req.path, req.params.eName, req.params.guids);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[DEL %s%s(%s,%s)]%o",req.baseUrl, req.path, req.params.eName, req.params.guids, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});


module.exports = router;
