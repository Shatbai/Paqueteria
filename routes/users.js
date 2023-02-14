var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.render('dashboard', { userId: 'Express', price:'23.45', lat:'-19.30049', long:'-13,0048373' });
});

module.exports = router;
