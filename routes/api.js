var express = require('express');
var router = express.Router();
const user = require('./users');

/* GET users listing. */
router.get('/search/:creds', function(req, res, next) {
    console.log(req.params);
    user.isCreated(req.params['creds']).then(function(result){
        res.status(200);
        res.json(result);
        res.end();
    }).catch(function(err){
        res.status(404);
        res.json({ status: 404, message: 'User with creds = ' + req.params['creds'] + ' not exists.', user: null });
        res.end();
    });
});
router.post('/login', function(req, res, next) {
    console.log('from post');
    console.log(req.body);

    user.auth(req.body['login'], req.body['password']).then(function(result){
        res.status(200);
        res.json(result);
        res.end();
    }).catch(function(err){
        res.status(404);
        res.end('Please check the data.');
    });
});

router.post('/register', function(req, res, next) {
    console.log(req.body);
    user.isExists(req.body['login']).then(function(result){
        res.status(400);
        res.end('User with same login had already registered.');
    }).catch(function(err){
        user.register(req.body['login'], req.body['password'])
            .then(function(result) {
                res.status(200);
                res.json(result);
                res.end();
            })
            .catch(function(error) {
                console.log('from catch');
                res.status(400);
                res.end('User with same login had already registered.')
            });
    });
});

module.exports = router;