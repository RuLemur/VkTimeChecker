const Request = require('../vkapi/vk_request.js');

const DB = require('../database/database');
const Helper = require('../helpers/helper.js')
var scheduler = require('node-schedule');

let requester = new Request();
let db = new DB();
let helper = new Helper();

db.getUsersIds(function (all_users_json) {
    start_scheduler(helper.getIdsStringList(all_users_json));
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
            session = active_session[0]
            if (!user['online']) {
                db.updateSession(session['id']);
                console.log(user['first_name'] + ' ' + user['last_name'] + ' user go offline');
            }
        } else {
            if (user['online']) {
                db.addNewSession(user['id'], user['online_mobile']);
                let out_str = user['first_name'] + ' ' + user['last_name'] + ' user go online';
                if (user['online_mobile'])
                {
                    out_str += ' with mobile'
                }
                console.log(out_str);
            }
        }
    })
}


// db.getUserInfo(vk_id, function (user_info) {
//
//     users_data['vk_data'].forEach(user_data => {
//         db.getUserOnlineByID(user_data['vk_id'], function (data) {
//             // console.log(data)
//             user_data['online_data'] = data;
//         })
//     });
//     // console.log(JSON.stringify(users_data))
//     setTimeout(function () {

// }, 1000)

// }

// ids = '69506234,39528985,347745573,30785819';
// requester.getFriendsIds(function (err, users_info) {
//     db.addNewUser(users_info);
// })


