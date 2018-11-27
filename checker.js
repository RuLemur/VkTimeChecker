const Requster = require('./requester.js');
const DB = require('./database.js');
var scheduler = require('node-schedule');

let requester = new Requster();
let db = new DB();

db.getUsers(function (all_users_json) {
    start_scheduler(getIdsStringList(all_users_json));
});

function start_scheduler(users) {
    scheduler.scheduleJob('*/20 * * * * *', function () {
        requester.rqForUsersOnline(users, function (err, data) {
            if (err) { throw err; }
            data.forEach(user => {
                refreshStatus(user);
                // console.log(user);
            });

        })
    });
}

function refreshStatus(user) {
    db.checkSessionIsActive(user['id'], function (active_session) {
        let session;
        if (active_session.length) {
            session = active_session[0]
            if (!user['online']) {
                db.updateSession(session['id']);
                console.log(user['first_name'] + ' ' + user['last_name'] + ' user go offline');
            }
        } else {
            if (user['online']) {
                db.addNewSession(user['id']);
                console.log(user['first_name'] + ' ' + user['last_name'] + ' user go online');
            }
        }
    })
}

// ids = '69506234,39528985,347745573,30785819';
// requester.getFriendsIds(function (err, users_info) {
//     db.addNewUser(users_info);
// })


function getIdsStringList(all_users) {
    var user_list;
    all_users.forEach(user => {
        user_list += user['vk_id'] + ',';
    });
    return user_list;
}

