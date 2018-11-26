var express = require('express');
var router = express.Router();
var path = require('path');


/* GET home page. */
router.post('/', function(req, res) {
    console.log(req.body.id + " moved to: " + req.body.move);
    res.sendStatus(200);
});
router.get('/', function(req, res){
    console.log("Someone joined the lobby!");
    res.sendFile('/Lobby/index.html' , { root : path.resolve(__dirname+"/../public")});
});

module.exports = router;
