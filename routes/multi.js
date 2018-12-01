let express = require('express');
let router = express.Router();
let path = require('path');

/* GET users listing. */
router.get('*', function(req, res, next) {
    res.sendFile('/Multi/index.html' , { root : path.resolve(__dirname+"/../public")});
});
module.exports = router;
