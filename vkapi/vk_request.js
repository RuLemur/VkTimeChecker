const fs = require("fs");
const helper = require("../helpers/helper");
const Client = require('node-rest-client').Client;
var vk_client = new Client();

const args = {
    parameters: {
        v: '5.90',
        access_token: fs.readFileSync("./vkapi/access_token.txt", "utf8")
    }
}

class VK_Request {

    rqForUsersOnline(ids, callback) {
        let param = args;
        param['parameters']['user_ids'] = ids;
        param['parameters']['fields'] = "online";
        vk_client.get("https://api.vk.com/method/users.get", args, function (data, response) {
            if (data['error']) {
                callback(new Error(data['error']['error_msg']), null)
            }

            callback(null, data['response']);
        });
    }

    getGroupMembers(group_id, callback) {
        this.rqForGroupMembers(group_id).then((data, err) => {
            if (data['response']['count'] > 1000) {
                callback(data['response']['items'])
                this.rqLargeGroupMembers(group_id, data['response']['count'], callback);
            } else {
                callback(data['response']['items']);
            }
        })
    }

    rqForGroupMembers(group_id, offset = 0) {
        return new Promise((resolve, reject) => {
            let param = args;
            param['parameters']['group_id'] = group_id;
            param['parameters']['fields'] = "first_name";
            param['parameters']['offset'] = offset;
            vk_client.get("https://api.vk.com/method/groups.getMembers", args, function (data, response) {
                if (data['error']) {
                    reject(new Error(data['error']['error_msg']), null)
                }
                resolve(data)
            });
        })
    }

    rqLargeGroupMembers(group_id, ids_count, callback) {
        for (let i = 1; i <= Math.floor(ids_count / 1000); i++) {
            this.rqForGroupMembers(group_id, i * 1000).then((data) => {
                // full_data['response']['items'].concat(data['response']['items']);
                // resolve()


                callback(data['response']['items']);
            })
        }
    }

    getFriendsIds(callback) {
        vk_client.get("https://api.vk.com/method/friends.get", args, function (data, response) {
            if (data['error']) {
                callback(new Error(data['error']['error_msg']), null)
            }

            callback(null, data['response']['items']);
        });
    }


}

module.exports = VK_Request;