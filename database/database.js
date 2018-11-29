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
        return new Promise(function (resolve, reject) {
            users_info.forEach(user_info => {
                let sql = `insert into users (vk_id, first_name, last_name) 
                values (${user_info['id']}, '${user_info['first_name']}', '${user_info['last_name']}');`
                con.query(sql, function (err, result) {
                    if (err && !err.message.includes('ER_DUP_ENTRY')) {
                        if (err) reject(err);
                    } else resolve(result)
                });
            });
        })
    }

    getUserInfo(vk_id) {
        return new Promise(function (resolve) {
            let sql = `select vk_id, first_name, last_name from users where vk_id = ${vk_id}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                resolve(result);
            })
        })

    }

    getUsersIds(callback) {
        let sql = `SELECT vk_id from users`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result);
            callback(result);
        });
    }

    addNewSession(vk_id, is_mobile) {
        let entry_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (!is_mobile)
            is_mobile = 0;
        let sql = `insert into online_time (user_id, entry_time, exit_time, is_mobile)
                   values (${vk_id}, '${entry_time}', NULL, ${is_mobile});`;
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

    getUserOnlineByID(vk_id, entry_time = null, exit_time = null) {
        return new Promise(function (resolve) {
            let sql = `select entry_time, exit_time, is_mobile from online_time where user_id = ${vk_id} and exit_time is not NULL`;
            if (entry_time) {
                sql += ` and entry_time >= ${entry_time}`
            }
            if (exit_time) {
                sql += ` and exit_time <= ${exit_time}`
            }
            con.query(sql, function (err, result) {
                if (err) throw err;
                resolve(result);
            });
        })

    }

}

module.exports = DB;
