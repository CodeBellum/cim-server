const db = require('sqlite');
const notifications = require('./notifications');
var nProvider = new notifications.provider();
// Methods to work with messages.
class MessageProvider {
    constructor(){
    }

    // Get all messages for specified user.
    getAllMessages(receiverId) {
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db').then(() => {
                    return db.all('SELECT TOP 1000 * FROM messages WHERE receiver_id = ? ORDER BY message_id desc', receiverId);
                })
                .then(function(res){
                    db.close();
                    if (res.length == 0)
                        reject({message: 'Messages for user with ID = ' + receiverId + ' were not found.'});
                    resolve(res);
                }).catch(function(err){
                console.log('User is not exists.');
                console.log(err);
                db.close();
                reject(err);
            })
        })
    };

    // Send message.
    send(senderId, receiverId, text){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db', { Promise }).then(() =>  {
                return db.run('INSERT INTO messages(sender_id, receiver_id, text) VALUES (?, ?, ?)',
                    senderId, receiverId, text);
            }).then(function(res){
                nProvider.add(senderId, 10);
                resolve(res);
            }).catch(function(err){
                console.log(err);
                db.close();
                reject(err);
            });
        });
    };

    // Find message by ID after send.
    find(id){
        return new Promise(function(resolve, reject){
            db.open('./apixml/users.db').then(() => {
                    return db.get('SELECT * FROM messages WHERE id = ?', id);
                })
                .then(function(res){
                    db.close();
                    if (res == undefined)
                        reject({message: 'Message with ID = ' + receiverId + ' was not found.'});
                    resolve(res);
                }).catch(function(err){
                console.log('Message is not exists.');
                console.log(err);
                db.close();
                reject(err);
            })
        })
    }
}

exports.provider = MessageProvider;