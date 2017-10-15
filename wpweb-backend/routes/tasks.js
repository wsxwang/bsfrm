var express = require('express');
var path = require('path');
var router = express.Router();

var taskMgr = require(path.join(__dirname, '../src/api/taskMgr'));

/* webservice:任务管理服务. */

router.get('/listTasks', function(req, res, next) {
    // 允许跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json(taskMgr.allTasks());
});

router.post('/addTask', function(req, res, next) {
    // 允许跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
});



module.exports = router;
