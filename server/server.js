const Request = require('../vk_api/vk_request.js');

const DB = require('../database/database');
const helper = require('../helpers/helper.js');
var scheduler = require('node-schedule');

let requester = new Request();
let db = new DB();

db.getUsersIds(function (all_users) {
    helper.getIdsStringList(all_users, function (users_list_string) {
        start_scheduler(users_list_string);
    })

});

function start_scheduler(users) {
    scheduler.scheduleJob('*/20 * * * * *', function () {
        requester.rqForUsersOnline(users, function (err, data) {
            if (err) {
                throw err;
            }
            data.forEach(user => {
                refreshStatus(user);
            });

        })
    });
}

function refreshStatus(user) {
    db.checkSessionIsActive(user['id'], function (active_session) {
        let session;
        if (active_session.length) {
            session = active_session[0];
            if (!user['online']) {
                db.updateSession(session['id']);
                console.log(user['first_name'] + ' ' + user['last_name'] + ' user go offline');
            }
        } else {
            if (user['online']) {
                db.addNewSession(user['id'], user['online_mobile']);
                let out_str = user['first_name'] + ' ' + user['last_name'] + ' user go online';
                if (user['online_mobile']) {
                    out_str += ' with mobile'
                }
                console.log(out_str);
            }
        }
    })
}

//
// requester.getGroupMembers(65309446, function (inter_data) {
//     db.addNewUser(inter_data);
//     // console.log("hi1");
// }).then((data) => {
//         db.addNewUser(data);
//     },
//     error => {
//         console.log(error.message);
//     }
// )

// 93619808 - 30
// 65309446 - 76k
// 57363961  - 751