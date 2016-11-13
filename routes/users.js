var fs = require('fs');
var path = require('path');
const path_to_file = "./apixml/users.json";

function checkUserIsCreated(creds) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path_to_file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(findUserById(data, creds).then(function(result){
          return result;
        }).catch(function(res){
          return findUserByLogin(data, creds).then(function(result){
            return result;
          }).catch(function (res) {
            return res;
          })
        }));
      }
    });
  });
}

function findUserById(jsonstr, id) {
  return new Promise(function(resolve,reject){
    var lib = JSON.parse(jsonstr);
    lib['users'].forEach(function(user, i, arr) {
      if (user['id'] == id) {
        resolve({ status: 200, message: 'OK', user: user });
      }
    });
    reject({ status: 404, message: 'User with id = ' + id + ' not exists.', user: null });
  });
}

function findUserByLogin(jsonstr, login) {
  return new Promise(function(resolve, reject){
    var lib = JSON.parse(jsonstr);
    lib['users'].forEach(function(user, i, arr) {
      if (user['login'] == login) {
        resolve({ status: 200, message: 'OK', user: user });
      }
    });
    reject({ status: 404, message: 'User with login = ' + login + ' not exists.', user: null });
  });
}

function authUser(login, password) {
  return new Promise(function(resolve, reject){
    var data = fs.readFileSync(path_to_file, 'utf8');
    var lib = JSON.parse(data);
    lib['users'].forEach(function(user, i, arr) {
      if (user['login'] == login && user['password'] == password) {
        resolve({ status: 200, message: 'OK', user: user });
      }
    });
    reject({ status: 404, message: 'User with login = ' + login + ' not exists.', user: null });
  });
}

function regUser(login, password) {
  return new Promise(function(resolve, reject){
    resolve(fs.readFileSync(path_to_file, 'utf8'));
  }).then(function(data) {
    //console.log(data);
    var lib = JSON.parse(data);
    console.log(lib);
    var length = lib['users'].length;
    var lastId = 1;

    if (length > 0)
    {
      lastId = lib['users'][length-1]['id'];
    }

    lib['users'][length]={id: lastId + 1, login: login, password: password};
    fs.writeFileSync(path_to_file, JSON.stringify(lib), 'utf8');

    console.log(lastId);
    //lib['users'].add({});
    return{id: lastId + 1, login: login, password: password};
  });
}

exports.isCreated = checkUserIsCreated;
exports.register = regUser;
exports.auth = authUser;
exports.findByLogin = findUserByLogin;
exports.findById = findUserById;
