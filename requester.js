const fs = require("fs");
const Client = require('node-rest-client').Client;

var vk_client = new Client();

var args = {
    parameters: {
        fields: 'online',
        user_ids: '210700286,69506234',
        v: '5.90',
        access_token: fs.readFileSync("access_token.txt", "utf8")
    }
}

class Requster {

    rqForUsersOnline(ids, callback) {
        args['parameters']['user_ids'] = ids;
        vk_client.get("https://api.vk.com/method/users.get", args, function (data, response) {
            if (data['error']) {
                callback(new Error(data['error']['error_msg']), null)
            }

            callback(null, data['response']);
        });
    }

    getFriendsIds(callback) {
        vk_client.get("https://api.vk.com/method/friends.get", args, function (data, response) {
            if (data['error']) {
                callback(new Error(data['error']['error_msg']), null)
            }

            callback(null, data['response']['items']);
        });
    }

};

module.exports = Requster;