var express = require('express');
var path = require('path');
var router = express.Router();

var api = require(path.join(__dirname, '../src/api/custom_entity'));

var handelInfo=function(info, err) {
}

/* webservice:自定义实体. */

// get all
router.get('/', function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json(mgr.allUsers());
});

// find user，参数是用户id的字符串
router.get('/:id', function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json(mgr.userByID(req.params['id']));
})

// add user
router.post('/', function (req,res,next) {
    mgr.addUser(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json({status:"success", message:"add user success"});
})

// delete user
router.delete('/:id', function (req,res,next) {
    mgr.delUser(req.param('id'));
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json({status:"success", message:"delete user success"});
})

// modify user
router.put('/', function (req,res,next) {
	mgr.modifyUser(req.body);
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json({status:"success", message:"modify user success"});
})

// options
router.options('/', function (req,res,next) {
	next();
})


module.exports = router;
