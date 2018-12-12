module.exports = {

    getIdsStringList: function (all_users, callback) {
        let str_list = [];
        do {
            let users_list = '';
            let n = all_users.length >= 250 ? 250 : all_users.length;
            for (let i = 0; i < n; i++) {
                users_list += all_users.shift()['vk_id'] + ',';
            }
            str_list.push(users_list);
        }
        while (all_users.length !== 0);
        {
            callback(str_list);
        }
    }

};
