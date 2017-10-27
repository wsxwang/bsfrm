var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity'));
var base = require(path.join(__dirname, '../src/cmp/base'));

/*
webservice:
定制实体和关系的访问路由
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
		base.logger4js_api.info("[GET /api/custom_entity]%d", ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET /api/custom_entity]%o", e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 获取所有实体定义的名称
router.get('/name',function(req, res, next) {
	base.logger4js_api.trace("[GET %s%s]",req.baseUrl, req.path);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.allEntityName();
		base.logger4js_api.info("[GET /api/custom_entity/name]%d", ret.length);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET /api/custom_entity]%o", e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 获取指定实体（根据name）的完整元数据（包含字段定义）
router.get('/:name', function (req, res, next) {
	base.logger4js_api.trace("[GET %s%s%s]",req.baseUrl, req.path, req.params.name);
	if(req.params.name == 'name'){
		next();
	}
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
		var ret = api.completeEntityMetaData(req.params.name);
		base.logger4js_api.info("[GET /api/custom_entity/%s] OK", req.params.name);
        res.json(ret);
    }catch (e){
		base.logger4js_api.error("[GET /api/custom_entity/%s]%o", req.params.name, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

// 修改一批实体定义，若name字段不存在则新建，参数是[{name:xxx,...},{}...]
router.put('/', function (req,res,next) {
	base.logger4js_api.trace("[PUT %s%s] %d",req.baseUrl, req.path, req.body.length);
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateEntitys(req.body);
		base.logger4js_api.info("[PUT /api/custom_entity/] %d OK", req.body.length);
        res.status(201).json({message:"modify success"});
    }catch (e){
		base.logger4js_api.error("[PUT /api/custom_entity/] %d fail: %o", req.body.length, e);
        res.status(500).json(e['error']==null?e['message']:e['error'].toString());
    }
});

/*
// 获取指定实体（根据name）的所有字段
router.get('/:name/fields/', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
    //    res.json(api.fieldsByEID(req.params.name));
		
    }catch (e){
        res.status(500).json(e);
    }
})







// get all, return [{},{},...]
router.get('/', function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.allEntity());
    }catch (e){
        res.status(500).json(e);
    }
});

// find ，parameter is ID, return {}
router.get('/:id', function (req, res, next) {
    if(req.params.id == 'fields'){
        next();
        return;
    }
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.entityByID(req.params.id));
    }catch (e){
        res.status(500).json(e);
    }
})

// add, parameter is [{},{}]
router.post('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        fillGuid(req.body);
        api.insertEntitys(req.body);
        res.status(201).json({message:"add success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// delete , parameter is id
router.delete('/:id', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.delEntity(req.params.id);
        res.status(204).json({message:"delete success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// modify , parameter is [{},{},...]
router.put('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateEntitys(req.body);
        res.status(201).json({message:"modify success"});
    }catch (e){
        res.status(500).json(e);
    }
})


//////////////////////////////////////////////////////////////////////////////////
//fields
// get all, return [{},{},...]
router.get("/fields", function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.allFields());
    }catch (e){
        res.status(500).json(e);
    }
});
// find ，parameter is ID, return {}
router.get('/fields/:id', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.fieldByID(req.params.id));
    }catch (e){
        res.status(500).json(e);
    }
})

// find ，parameter is EID, return [{},{},...]
router.get('/:eid/fields/', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.fieldsByEID(req.params.eid));
    }catch (e){
        res.status(500).json(e);
    }
})

// add, parameter is [{},{}]
router.post('/fields/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.insertFields(req.body);
        res.status(201).json({message:"add success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// delete , parameter is id
router.delete('/fields/:id', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.delField(req.params.id);
        res.status(204).json({message:"delete success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// delete , parameter is entity id
router.delete('/:eid/fields/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.delFieldsByEID(req.params.eid);
        res.status(204).json({message:"delete success"});
    }catch (e){
        res.status(500).json(e);
    }
})
// modify , parameter is [{},{},...]
router.put('/fields/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateFields(req.body);
        res.status(201).json({message:"modify success"});
    }catch (e){
        res.status(500).json(e);
    }
})
*/
//////////////////////////////////////////////////////////////////////////////////
// records:[{ID:'xxxx',...},{},...],
var fillGuid=function (records) {
    for(var i in records){
        if((records[i]['ID'] == null) || (records[i]['ID'] == '')){
            records[i]['ID'] = base.newGuid();
        }
    }
};

module.exports = router;
