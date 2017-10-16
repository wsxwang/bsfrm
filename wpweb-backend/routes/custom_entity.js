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
    res.status(400);
    res.json({message:"not implemented"});
    res.end();
})

// add
router.post('/', function (req,res,next) {
    api.UpdateToStore(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(201);
    res.json({message:"add success"});
})

// delete user
router.delete('/:id', function (req,res,next) {
    api.del(req.param('id'));
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(204);
    res.json({message:"delete success"});
})

// modify user
router.put('/', function (req,res,next) {
    api.UpdateToStore(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(201);
    res.json({message:"modify success"});
})

// options
router.options('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(400);
    res.json({message:"not implemented"});
})


module.exports = router;
