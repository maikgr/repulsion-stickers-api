const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Schema = mongoose.Schema;
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'Db service connection error: '));
db.on('connected', () => console.log('Connected to db service.'));
db.on('disconnected', () => console.log('Disconnected from db service.'));

const stickerSchema = new Schema({
    keyword: String,
    url: String
});
const Sticker = mongoose.model('stickers', stickerSchema);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://repulsion-stickers-site.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.get('/all', (req, res) => {
    Sticker.find().select({ "_id": 0, "__v": 0 }).exec((err, stickers) => {
        if (err) console.error(err);
        res.send(stickers);
    });
})

app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}.`));