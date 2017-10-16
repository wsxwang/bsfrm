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
    res.json(api.readAllFromStore());
});

// find ，parameter is ID
router.get('/:id', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json(api.readOneFromStore(req.params.id));
})

// add
router.post('/', function (req,res,next) {
    api.UpdateToStore(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(201).json({message:"add success"});
})

// delete user
router.delete('/:id', function (req,res,next) {
    api.delFromStore(req.params.id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(204).json({message:"delete success"});
})

// modify user
router.put('/', function (req,res,next) {
    api.UpdateToStore(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(201).json({message:"modify success"});
})

// options
router.options('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(400).json({message:"not implemented"});
})


module.exports = router;
