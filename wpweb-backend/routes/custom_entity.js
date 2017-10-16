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
    res.json(api.metaReadAllFromStore());
});

// find ，parameter is ID
router.get('/:id', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json(api.metaReadOneFromStore(req.params.id));
})

// add
router.post('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
	if(api.metaUpdateToStore(req.body)){
		res.status(201).json({message:"add success"});
	}
	else{
		res.status(400).json({message:"parameter invalid"});
	}
})

// delete user
router.delete('/:id', function (req,res,next) {
    api.metaDelFromStore(req.params.id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(204).json({message:"delete success"});
})

// modify user
router.put('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
	if(api.metaUpdateToStore(req.body)){
		res.status(201).json({message:"modify success"});
	}
	else{
		res.status(400).json({message:"parameter invalid"});
	}
})

// options
router.options('/', function (req,res,next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.status(400).json({message:"not implemented"});
})


module.exports = router;
