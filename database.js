const mysql = require('mysql')

//TODO: 
var con = mysql.createConnection({
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
                if (!err.message.includes('ER_DUP_ENTRY')){
                    if (err) throw err;
                }
            });
        });
    }

    getUsers(callback) {
        let sql = `SELECT vk_id from users`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result);
            callback(result);
        });
    }

    addNewSession(users_id) {
        let entry_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = `insert into online_time (user_id, entry_time, exit_time)
                   values (${users_id}, '${entry_time}', NULL);`;
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log("Result: " + result);
        });
    }

    checkSessionIsActive(user_id, callback){
        let sql = `select * from online_time where user_id = ${user_id} and exit_time is NULL`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }

    updateSession(id_session){
        let exit_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = `update online_time set exit_time = '${exit_time}' where id=${id_session}`;
        // console.log(sql);
        
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    }

    getUserOnlineByID(user_id, callback){
        let sql = `select * from online_time where user_id = ${user_id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            callback(result);
        });

    }
}

module.exports = DB;
