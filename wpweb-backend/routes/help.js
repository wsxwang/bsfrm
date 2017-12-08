var express = require('express');
var path = require('path');
var router = express.Router();

// 帮助页面
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/htmls/help.html'));
});

module.exports = router;
