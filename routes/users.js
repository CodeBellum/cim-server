const db = require('sqlite');
const notifications = require('./notifications');
var nProvider = new notifications.provider();

// Methods to work with users.
class UsersProvider {
  constructor(){

  }

  // Finds user with specified login or id.
  find(cred){
    return new Promise(function(resolve, reject){
      db.open('./apixml/users.db').then(() => {
            return db.get('SELECT * FROM users WHERE (login = ? OR id = ?) AND isActive = 1', cred, cred);
          })
          .then(function(res){
            db.close();
            resolve(res);
          }).catch(function(err){
        console.log('User is not exists.');
        console.log(err);
        db.close();
        reject(err);
      });
    });
  };

  // Register user.
  reg(user){
    return new Promise(function(resolve, reject){
      db.open('./apixml/users.db', { Promise }).then(() =>  {
        return db.run('INSERT INTO users(login, password, email, isActive, genderId) VALUES (?, ?, ?, ?, ?)', user['login'],
            user['password'], user['email'], 1, user['gender']);
      }).then(function(res){

        // Log register operation.
        db.run('INSERT INTO Logs(user_id, operation_id) VALUES (?, ?)', res['lastID'], 6);
        db.close();
        resolve(res);
      }).catch(function(err){
        console.log(err);
        db.close();
        reject(err);
      });
    });
  };

  // Authenticate user.
  auth(login, password) {
    return new Promise(function(resolve, reject){
      db.open('./apixml/users.db').then(() => {
            return db.get('SELECT * FROM users WHERE login = ? AND password = ? AND isActive = 1', login, password);
          })
          .then(function(res){
            if (res == undefined)
            {
              db.close();
              reject(false);
            }

            // Update last login date.
            db.run('UPDATE users SET lastLogin = datetime(\'now\') WHERE id = ?', res['id']);

              // Log register operation.
              db.run('INSERT INTO Logs(user_id, operation_id) VALUES (?, ?)', res['id'], 1);
            db.close();
            resolve(res);
          }).catch(function(err){
        console.log('User is not exists.');
        console.log(err);
        db.close();
        reject(false);
      })
    });
  };

  // Changes user info.
  change(id, user){
    return new Promise(function(resolve, reject){
      db.open('./apixml/users.db', { Promise }).then(() =>  {
        return db.run('UPDATE users SET password = ?, email = ?, genderId = ? WHERE id = ?',
            user['password'], user['email'], user['gender'], id);
      }).then(function(res){
        db.close();

          // Log update operation.
          db.run('INSERT INTO Logs(user_id, operation_id) VALUES (?, ?)', id, 8);
        resolve(res);
      }).catch(function(err){
        console.log(err);
        db.close();
        reject(err);
      });
    });
  };

  // Inactivates user.
  deleteUser(id){
    return new Promise(function(resolve, reject){
      db.open('./apixml/users.db', { Promise }).then(() =>  {
        return db.run('UPDATE users SET isActive = 0 WHERE id = ?', id);
      }).then(function(res){

          // Log deactivate operation.
          db.run('INSERT INTO Logs(user_id, operation_id) VALUES (?, ?)', id, 7);
        db.close();
        resolve(res);
      }).catch(function(err){
        console.log(err);
        db.close();
        reject(err);
      });
    });
  };
}

exports.provider = UsersProvider;
