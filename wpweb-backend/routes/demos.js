var express = require('express');
var path = require('path');
var router = express.Router();

/* demo. */
router.get('/', function(req, res, next) {
    res.sendfile(path.join(__dirname, '../public/htmls/demos.html'));
});

module.exports = router;
