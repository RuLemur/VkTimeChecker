const VK_Request = require('../vk_api/vk_request');
const DB = require("../database/database.js");
let db = new DB();
let requester = new VK_Request();

module.exports = {
    getUserOnlineData: function (vk_id, callback) {
        let users_data = {};
        db.getUserInfo(vk_id).then(vk_id => {
            users_data['vk_data'] = vk_id;
            return users_data;
        }).then(user_data => {
            db.getUserOnlineByID(vk_id).then(online_data => {
                users_data['vk_data'][0]['online_data'] = online_data;
                return users_data;
            }).then((users_data) => {
                callback(users_data);
            })
        })

    },
    getUserData: function (vk_id, callback) {
        let users_data = {};
        //todo: проверка на пустоту и валидные значения
        Promise.all(vk_id.split(',').map(function (id) {
            return db.getUserInfo(id);

        }))
            .then(vk_id => {
                users_data['vk_data'] = vk_id;
                callback(users_data);
            })
    },

    addUsersById: function (vk_ids, callback) {
        requester.rqForUsersOnline(vk_ids, function (err, users_info) {
            db.addNewUser(users_info).then(() => {
                    callback();
                },
                () => {
                    callback();
                });
        })
    }
}
