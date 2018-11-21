var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("Someone is playing!");

    res.sendFile('/Multi/index.html' , { root : path.resolve(__dirname+"/../public")});
});

module.exports = router;
