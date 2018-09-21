const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});
db.on('error', console.error.bind(console, 'Db service connection error: '));
db.on('connected', () => console.log('Connected to db service.'));
db.on('disconnected', () => console.log('Disconnected from db service.'));

const stickerSchema = new Schema({
    keyword: String,
    url: String,
    useCount: Number,
    upload: {
        id: String,
        username: String,
        date: Date
    }
});

const Sticker = mongoose.model('stickers', stickerSchema);

function getAll () {
    return Sticker.find().exec();
}

function getByKeyword (keyword) {
    return Sticker.findOne({ keyword: { '$regex': '^' + keyword + '$', '$options': 'i' } }).exec();
}

function getById (id) {
    return Sticker.findById(id).exec();
}

function search (query) {
    return Sticker.find({ keyword: { '$regex': query, '$options' : 'i'} }).exec();
}

function add (keyword, url, uploaderId, uploaderUsername) {
    let newSticker = new Sticker({
        keyword: keyword,
        url: url,
        useCount: 0,
        upload: {
            id: uploaderId,
            username: uploaderUsername,
            date: moment().format()
        }
    });

    newSticker.save((err) => {
        if (err) throw err;
    })

    return newSticker;
}

function update (id, sticker) {
    return Sticker.findByIdAndUpdate(id, {
        keyword: sticker.keyword,
        url: sticker.url,
        useCount: sticker.useCount,
        upload: sticker.upload
    }, {
        new: true
    }).exec();
}

function remove (id) {
    return Sticker.findByIdAndRemove(id).exec();
}

module.exports = {
    getAll: getAll,
    getByKeyword: getByKeyword,
    getById: getById,
    add: add,
    update: update,
    search: search,
    remove: remove
}
