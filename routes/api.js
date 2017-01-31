var express = require('express');
var router = express.Router();
const user = require('./users');
var messagesProvider = require('./messages');
var mProvider = new messagesProvider.provider();
var uProvider = new user.provider();

router.all('/login', requireAuth);

// Checks base auth. Should be placed in most places to avoid unauthorized API usage.
function requireAuth(req, res, next){
    var authStruct = parseAuth(req);
    uProvider.auth(authStruct.username, authStruct.password).then(function(result){
        next();
    }).catch(function(err){
        console.log(err);
        res.status(401);
        res.end();
    });
}

router.post('/login', function(req, res, next) {
        res.status(200);
        res.end();
    }
);

// Registers user. If login or email is already in use, then send error message.
router.post('/register', function(req, res, next) {
    console.log(req.body);
    uProvider.reg(req.body).then(function (result) {
        uProvider.find(result['lastID']).then((userFromDb) => {
            sendJsonOKResult(res, userFromDb);
        }).catch( function(err) {
            sendError(res, err);
        });
    }).catch(function(err){
        var error = {
            message: 'User with same email or login is already registered.'
        };
        sendError(res, error);
    });
});

router.all('/user', requireAuth);

router.put('/user', function(req, res, next){
    var authStruct = parseAuth(req);
    uProvider.find(authStruct.username).then((userFromDb) => {
        uProvider.change(userFromDb['id'], req.body).then(() => {
            uProvider.find(authStruct.username).then((result)=> {
                sendJsonOKResult(res, {message: 'User was successfully deleted.'});
            }).catch(function(err){
                sendError(res, err);
            });
        }).catch(function(err){
            sendError(res, err);
        });
    }).catch(function(err){
        sendError(res, err);
    });
});

router.delete('/user', function(req, res, next){
    var authStruct = parseAuth(req);
    uProvider.find(authStruct.username).then((userFromDb) => {
        uProvider.deleteUser(userFromDb['id']).then((result) => {
            sendJsonOKResult(res, result);
        }).catch(function(err){
            sendError(res, err);
        });
    }).catch(function(err){
        sendError(res, err);
    })
});

router.all('/messages', requireAuth);

router.get('/messages', function(req, res, next) {
    var authStruct = parseAuth(req);
    uProvider.find(authStruct.username).then((userFromDb) => {
        mProvider.getAllMessages(userFromDb['id']).then(function(result){
            sendJsonOKResult(res, result);
        }).catch(function(err){
            sendError(res, err);
        });
    }).catch( function(err) {
        sendError(res, err);
    });
});

router.post('/messages', function(req, res, next) {
    if (req.body['senderId'] == req.body['receiverId']) {
        sendError(res, {message: 'You cannot send message to yourself!'});
    }
    mProvider.send(req.body['senderId'], req.body['receiverId'], req.body['text']).then(function(result){
        mProvider.find(result['lastID']).then((message) => {
            sendJsonOKResult(res, message);
        }).catch( function(err) {
            sendError(res, err);
        });
    }).catch(function(err){
        sendError(res, err);
    });
});

function sendJsonOKResult(res, json){
    res.status(200);
    res.json(json);
    res.end();
}

function sendError(res, err) {
    res.status(400);
    res.json(err);
    res.end();
}

function parseAuth(req){

    // If you have questions please see http://stackoverflow.com/questions/5951552/basic-http-authentication-in-node-js
    var header=req.headers['authorization']||'',        // get the header
        token=header.split(/\s+/).pop()||'',            // and the encoded auth token
        auth=new Buffer(token, 'base64').toString(),    // convert from base64
        parts=auth.split(/:/),                          // split on colon
        username=parts[0],
        password=parts[1];
    return {username: username, password: password};
}

module.exports = router;