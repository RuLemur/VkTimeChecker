class Helper {

    getIdsStringList(all_users) {
        let user_list;
        all_users.forEach(user => {
            user_list += user['vk_id'] + ',';
        });
        return user_list;
    }
}

module.exports = Helper;