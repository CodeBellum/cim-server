var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/{creds}', function(req, res, next) {
    res.send(checkUserIsCreated(req.param('creds')));
});

function checkUserIsCreated(creds) {
    var path_to_file = path.join(__dirname, 'apixml', 'users.json');

    fs.readFile(path_to_file, (err, data) => {
        if (err) {
            console.log(err);
            return { status: 404, message: 'User with creds = ' + creds + ' not exists.', user: null };
        } else {

            // Check if user with current id exists.
            var idSearch = findUserById(data, creds);
            if (idSearch.status === 200) {
                return idSearch;
            }

            // Check if user with current login exists.
            var loginSearch = findUserByLogin(data, creds);
            if (loginSearch.status === 200) {
                return loginSearch;
            }

            return { status: 404, message: 'User with creds = ' + creds + ' not exists.', user: null };
        }
    });

}

function findUserById(jsonstr, id) {
    var lib = JSON.parse(jsonstr);
    lib.users.forEach(function(user, i, arr) {
        if (user.id === id) {
            return { status: 200, message: 'OK', user: user };
        }
    });
    return { status: 404, message: 'User with id = ' + id + ' not exists.', user: null };
}

function findUserByLogin(jsonstr, login) {
    var lib = JSON.parse(jsonstr);
    lib.users.forEach(function(user, i, arr) {
        if (user.login === login) {
            return { status: 200, message: 'OK', user: user };
        }
    });
    return { status: 404, message: 'User with login = ' + login + ' not exists.', user: null };
}

module.exports = router;