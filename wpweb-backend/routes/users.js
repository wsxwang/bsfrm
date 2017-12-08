var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/user_mgr'));
var base = require(path.join(__dirname, '../src/cmp/base'));

// webservice:用户管理服务.

// options
router.options('/', function (req,res,next) {
	base.logger4js_api.trace("[OPTIONS %s%s]",req.baseUrl, req.path);
    next();
})

// get all users
router.get('/', function(req, res, next) {
	base.logger4js_api.trace("[GET %s%s]",req.baseUrl, req.path);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allUsers();
		base.logger4js_api.info("[GET %s%s]%d", req.baseUrl, req.path, ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s]%o", req.baseUrl, req.path, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// find user，参数是用户id的字符串
router.get('/:id', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s(%s)]",req.baseUrl, req.path, req.params.id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.userByID(req.params.id);
		base.logger4js_api.info("[GET %s%s(%s)]OK",req.baseUrl, req.path, req.params.id);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET %s%s(%s)]%o",req.baseUrl, req.path, req.params.id, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

// add user，参数是一个对象
router.post('/', function (req,res,next) {
	base.logger4js_api.trace("[ADD %s%s(%o)]",req.baseUrl, req.path, req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.addUser(req.body);
		base.logger4js_api.info("[ADD %s%s(%o)]OK",req.baseUrl, req.path, req.body);
        res.status(201).json({message:"add success"});
    }catch (e){
		base.logger4js_api.error("[ADD %s%s(%o)]fail:%o",req.baseUrl, req.path, req.body, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

// delete user
router.delete('/:id', function (req,res,next) {
	base.logger4js_api.trace("[DEL %s%s(%s)]",req.baseUrl, req.path, req.params.id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.delUser(req.params.id);
		base.logger4js_api.info("[DEL %s%s(%s)]OK",req.baseUrl, req.path, req.params.id);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[DEL %s%s(%s)]%o",req.baseUrl, req.path, req.params.id, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

// modify user，参数是一个对象
router.put('/', function (req,res,next) {
	base.logger4js_api.trace("[PUT %s%s(%o)]",req.baseUrl, req.path, req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.modifyUser(req.body);
		base.logger4js_api.info("[PUT %s%s(%o)]OK",req.baseUrl, req.path, req.body);
        res.status(201).json({message:"modify success"});
    }catch (e){
		base.logger4js_api.error("[PUT %s%s(%o)]fail:%o",req.baseUrl, req.path, req.body, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
})

module.exports = router;
