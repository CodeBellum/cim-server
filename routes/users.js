const db = require('sqlite');

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
            db.run('UPDATE users SET lastLogin = datetime(\'now\') WHERE id = ?', res['id']);
            db.close();
            resolve(true);
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
