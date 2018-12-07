module.exports = {

    getIdsStringList: function (all_users, callback) {
        let user_list = '';
        all_users.forEach(user => {
            user_list += user['vk_id'] + ',';
        });
        callback(user_list);
    }

}
