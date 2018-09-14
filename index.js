const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Schema = mongoose.Schema;
const db = mongoose.connection;

const sitelist = ['https://repulsion-stickers-site.herokuapp.com, http://localhost:8080']
const corsOptions = {
    origin: function (origin, callback) {
        if (sitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    }
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});
db.on('error', console.error.bind(console, 'Db service connection error: '));
db.on('connected', () => console.log('Connected to db service.'));
db.on('disconnected', () => console.log('Disconnected from db service.'));

const stickerSchema = new Schema({
    keyword: String,
    url: String,
    upload: {
        id: String,
        username: String,
        date: Date
    },
    useCount: Number
});
const Sticker = mongoose.model('stickers', stickerSchema);

app.options('/all', cors(corsOptions));
app.get('/all', cors(corsOptions), (req, res) => {
    Sticker.find().select({
        "_id": 0,
        "__v": 0
    }).exec((err, stickers) => {
        if (err) console.error(err);
        stickers.sort(compareSticker);
        res.send(stickers);
    });
})

app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}.`));

function compareSticker(stickerA, stickerB) {
    if (stickerA.keyword < stickerB.keyword) {
        return -1;
    } else if (stickerA.keyword > stickerB.keyword) {
        return 1;
    } else {
        return 0;
    }
}