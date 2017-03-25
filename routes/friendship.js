const db = require('sqlite');
const notifications = require('./notifications');
var nProvider = new notifications.provider();


/**
 * Friendship provider class.
 */
class FriendshipProvider {
    
    /**
     * The empty constuctor.
     * @constructor
     */
  constructor(){

  }

  /**
   * Adds a friendship request to the 'friendship' table.
   * @param {int} userId - The user ID.
   * @param {int} friendId - The friend ID.
   */
    friend(userId, friendId){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('INSERT INTO friendship(first_user_id, second_user_id, is_verified) VALUES (?, ?, 0)', userId, friendId);
            }).then(function(res){
                nProvider.add(friendId, 9);

                // Log friendship operation.
                db.run('INSERT INTO Logs(user_id, operation_id, operation_info) VALUES (?, ?, ?)', userId, 9,
                    'User ' + userId + ' and user ' + friendId + ' become friends.');
                db.close();
                resolve(res);
            }).catch(function(err){
                console.log(err);
                db.close();
                reject(err);
            });
        });
    };

/**
 * Accepts or declines a friendship request. Can be used for removing friends.
 * @param {int} friendshipId - The friendship ID.
 * @param {int} accepted - 1 - accepted, 2 - declined.
 */
     verifyFriendship(friendshipId, accepted){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('UPDATE friendship SET isVerified = ? WHERE relation_id = ?',accepted, friendshipId);
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

/**
 * Receives all friends for specified user.
 * @param {int} userId - The user ID. 
 */
    findAllFriends(userId){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('Select from friendship WHERE first_user_id = ? or second_user_id = ?', userId, userId);
            }).then(function(res){
                db.close();
                resolve(res);
            }).catch(function(err){
                console.log(err);
                db.close();
                reject(err);
            });
        });
    }
}

exports.provider = FriendshipProvider;