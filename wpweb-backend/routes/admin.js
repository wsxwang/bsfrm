var express = require('express');
var path = require('path');
var router = express.Router();

/* 管理. */
router.get('/', function(req, res, next) {
    res.sendfile(path.join(__dirname, '../public/htmls/admin.html'));
});

module.exports = router;
