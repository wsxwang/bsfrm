var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity'));

var handelInfo=function(info, err) {
}

/* webservice: custom entity and its fields. */

// get all
router.get('/', function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.allEntity());
    }catch (e){
        res.status(500).json(e);
    }
});

// find ，parameter is ID
router.get('/:id', function (req, res, next) {
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

// options
router.options('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(400).json({message:"not implemented"});
})

//////////////////////////////////////////////////////////////////////////////////
//fields
// get all
//... 路由不到这里！！！
router.get("/'fields'", function(req, res, next) {
    console.log("aaa");
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.allFields());
    }catch (e){
        res.status(500).json(e);
    }
});
// find ，parameter is ID
router.get('/fields/:id', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.fieldByID(req.params.id));
    }catch (e){
        res.status(500).json(e);
    }
})
// find ，parameter is EID
//... 路由不到这里！！！
router.get('/fields/:eid', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    try {
        res.json(api.fieldsByEID(req.params.eid));
    }catch (e){
        res.status(500).json(e);
    }
})

module.exports = router;
