var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname + '/../client/', 'build', 'index.html'));
});

router.post('/', function(req, res, next) {
  console.log(req.body.text)
});

module.exports = router;
