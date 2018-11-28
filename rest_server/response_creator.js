const DB = require("../database/database.js");
var db = new DB();

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
    }
}
