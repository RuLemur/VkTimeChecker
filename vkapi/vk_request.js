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

    async getGroupMembers(group_id, callback) {
        console.log("start read group members");
        let first_data = await this.rqForGroupMembers(group_id);
        if (first_data['response']['count'] <= 1000) {
            console.log(`end read group members ${first_data['response']['count']} total`);
            return first_data['response']['items'];
        } else {
            let items = first_data['response']['items'];
            for (let i = 1; i <= Math.floor(first_data['response']['count'] / 1000); i++) {
                let data = await this.rqForGroupMembers(group_id, i * 1000)
                items = items.concat(data['response']['items'])
                if (i % 10 === 0) {
                    callback(items);
                    console.log(process.memoryUsage());
                    console.log(`return intermediate data ${items.length} items`)
                    items = []
                }
            }
            console.log(`end read group members ${items.length} total`);
            return items;
        }
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