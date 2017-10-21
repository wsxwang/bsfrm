var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity_data'));
var base = require(path.join(__dirname, '../src/cmp/base'));

/*
webservice: 定制实体数据的访问
所有操作均针对指定的实体（通过实体name）
 */

 // options
router.options('/', function (req,res,next) {
    next();
})

// get all records, return {}
router.get('/:ename', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.allRecords(req.params.ename));
    }catch (e){
        res.status(500).json(e);
    }
})

// find record by guid, return {}
router.get('/:ename/:guid', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.recordByGuid(req.params.ename, req.params.guid));
    }catch (e){
        res.status(500).json(e);
    }
})

// add, parameter is [{},{}],ignore guid in parameter items
router.post('/:ename/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        fillGuid(req.body);
        api.insertRecords(req.params.ename, req.body);
        res.status(201).json({message:"add success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// delete records, parameter is [guid,guid,...]
router.delete('/:ename/:guidArray', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.delRecords(req.params.ename, req.params.guidArray);
        res.status(204).json({message:"delete success"});
    }catch (e){
        res.status(500).json(e);
    }
})

// modify , parameter is [{guid:'...',...},{guid:'...',...},...]
router.put('/:ename/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        api.updateRecords(req.params.ename, req.body);
        res.status(201).json({message:"modify success"});
    }catch (e){
        res.status(500).json(e);
    }
})

//////////////////////////////////////////////////////////////////////////////////
// records:[{guid:'xxxx',...},{},...],
var fillGuid=function (records) {
    for(var i in records){
        if((records[i]['guid'] == null) || (records[i]['guid'] == '')){
            records[i]['guid'] = base.newGuid();
        }
    }
};

module.exports = router;
