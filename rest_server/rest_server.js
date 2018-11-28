const express = require('express');
const app = express();
const respCreator = require('./response_creator.js');

console.log("Starting setup rest_server")
app.get('/getUsers', function (req, res) {
    respCreator.getUserOnlineData(req.query["vk_id"], function (data) {
        res.json(data);
    })
});

app.listen(3000, function (port) {
    console.log('Listening on port, ' + 3000)
})