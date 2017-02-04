const db = require('sqlite');

// Methods to work with users.
class NotificationsProvider {
    constructor() {

    }

    // Add notification for user.
    add(userId, operationId){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('INSERT INTO notifications(user_id, operation_id) VALUES (?, ?)', userId,
                    operationId);
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

    // Receive notifications for user.
    receiveForUser(userId){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('SELECT * FROM notifications WHERE user_id = ?', userId);
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

    // Register user.
    clearForUser(userId){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('DELETE FROM notifications WHERE user_id = ?', userId);
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

exports.provider = NotificationsProvider;