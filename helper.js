function getIdsStringList(all_users) {
    var user_list;
    all_users.forEach(user => {
        user_list += user['vk_id'] + ',';
    });
    return user_list;
}


module.exports = Helper;