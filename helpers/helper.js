module.exports = {

    getIdsStringList: function (all_users, callback) {
        let user_list = '';
        all_users.forEach(user => {
            user_list += user['vk_id'] + ',';
        });
        callback(user_list);
    },

    generateLargeGetMembersArgs: function (group_id, ids_count, callback) {
        let return_str = 'return [';
        let rq_code = "{";
        for (let i = 0; i <= Math.floor(ids_count / 1000); i++) {
            rq_code += `var a${i} = API.groups.getMembers({"group_id":${group_id},"fields":"online","offset":${1000 * i}}).items;`;
            return_str += `a${i},`;
        }
        rq_code += return_str + `];}`;
        callback(rq_code);
    }

}
