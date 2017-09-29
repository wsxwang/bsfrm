var express = require('express');
var path = require('path');
var router = express.Router();

/* 登录. */
router.get('/', function(req, res, next) {
    res.sendfile(path.join(__dirname, '../public/htmls/login.html'));
});

module.exports = router;
