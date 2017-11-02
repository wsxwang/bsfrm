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
        res.json(api.allRecords(req.params.eName));
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s)]%o",req.baseUrl, req.path, req.params.eName, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

router.get('/:eName/:guid', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s,%s)]",req.baseUrl, req.path, req.params.eName, req.params.guid);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.recordByGuid(req.params.eName, req.params.guid));
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s,%s)]%o",req.baseUrl, req.path, req.params.eName, req.params.guid, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})


module.exports = router;
