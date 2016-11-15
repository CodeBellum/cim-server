var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IIM' });
});

/*router.get('/public/javascripts/:bla', function(req, res, next) {
  res.sendfile('../public/javascripts/bootstrap.js');
});
router.get('/public/stylesheets/:bla', function(req, res, next) {
  res.sendfile('../public/stylesheets/bootstrap.min.css');
});*/

module.exports = router;
