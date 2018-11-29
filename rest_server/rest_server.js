const express = require('express');
const app = express();
const respCreator = require('./response_creator.js');

console.log("Starting setup rest_server")
app.get('/getUsersOnline', function (req, res) {
    respCreator.getUserOnlineData(req.query["vk_id"], function (data) {
        res.json(data);
    })
});

app.get('/getUsersData', function (req, res) {
    respCreator.getUserData(req.query["vk_id"], function (data) {
        res.json(data);
    })
});

app.post('/addUser', function (req, res) {
    //todo: добавить возврат результата (добавленных пользователей, тех которые есть и неправильные id)
    respCreator.addUsersById(req.query["vk_ids"], function () {
        res.status(204).send();

    })
});

app.listen(3000, function (port) {
    console.log('Listening on port, ' + 3000)
})