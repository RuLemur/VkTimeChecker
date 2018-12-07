const Request = require('../vkapi/vk_request.js');

const DB = require('../database/database');
const helper = require('../helpers/helper.js')
var scheduler = require('node-schedule');

let requester = new Request();
let db = new DB();

// db.getUsersIds(function (all_users_json) {
//     helper.getIdsStringList(all_users_json, function (users_list_string) {
//         start_scheduler(users_list_string);
//     })
//
// });

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
            session = active_session[0]
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


// ids = '69506234,39528985,347745573,30785819';
requester.getGroupMembers(68471405, function (inter_data) {
    db.addNewUser(inter_data);
    // console.log("hi1");
}).then((data) => {
    db.addNewUser(data);
})

