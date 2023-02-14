var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { userId: 'Express', price:'23.45', lat:'-19.30049', long:'-13,0048373' });
});

module.exports = router;
