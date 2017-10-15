var express = require('express');
var path = require('path');
var router = express.Router();

/* 桌面. */
router.get('/', function(req, res, next) {
    res.sendfile(path.join(__dirname, '../public/htmls/home.html'));
});

module.exports = router;
