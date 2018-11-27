const mysql = require('mysql')
const fs = require('fs')
//TODO:

// const con = mysql.createConnection(fs.readFileSync("./database/db_connectors.json", "utf8"));
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root"
});

class DB {
    constructor() {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
        con.query("USE mydb;", function (err, result) {
            if (err) throw err;
            // console.log("Result: " + result);
        });
    }

    addNewUser(users_info) {
        users_info.forEach(user_info => {
            let sql = `insert into users (vk_id, first_name, last_name) 
                values (${user_info['id']}, '${user_info['first_name']}', '${user_info['last_name']}');`
            con.query(sql, function (err, result) {
                if (!err.message.includes('ER_DUP_ENTRY')) {
                    if (err) throw err;
                }
            });
        });
    }

    getUserInfo(vk_id, callback){
        let sql = `select * from users where vk_id = ${vk_id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            callback(result)
        })
    }

    getUsers(callback) {
        let sql = `SELECT vk_id from users`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result);
            callback(result);
        });
    }

    addNewSession(vk_id) {
        let entry_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = `insert into online_time (user_id, entry_time, exit_time)
                   values (${vk_id}, '${entry_time}', NULL);`;
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log("Result: " + result);
        });
    }

    checkSessionIsActive(vk_id, callback) {
        let sql = `select * from online_time where user_id = ${vk_id} and exit_time is NULL`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }

    updateSession(id_session) {
        let exit_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = `update online_time set exit_time = '${exit_time}' where id=${id_session}`;
        // console.log(sql);

        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    }

    getUserOnlineByID(vk_id, callback, entry_time = null, exit_time = null) {
        let sql = `select entry_time, exit_time from online_time where user_id = ${vk_id} and exit_time is not NULL`;
        if (entry_time) {
            sql += ` and entry_time >= ${entry_time}`
        }
        if (exit_time) {
            sql += ` and exit_time <= ${exit_time}`
        }
        con.query(sql, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }

}

module.exports = DB;
