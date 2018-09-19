const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Joi = require('joi');
const ExpressJoi = require('express-joi-validator');
const stickerService = require('./services/sticker-service');
const responseResult = require('./models/response-result');
const imageService = require('./services/image-service');

const app = express();
const sitelist = ['https://repulsion-stickers-site.herokuapp.com, http://localhost:8080'];
const corsOptions = {
    origin: function (origin, callback) {
        if (sitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    }
};

const stickerSchema = {
    body: {
        keyword: Joi.string().lowercase().min(3).required(),
        url: Joi.string().uri().required(),
        useCount: Joi.number().min(0).optional(),
        upload: {
            id: Joi.number().optional(),
            username: Joi.string().optional()
        }
    }
}

app.use(cors(), bodyParser.json());

app.get('/api/stickers', (req, res) => {
    stickerService.getAll()
        .then((stickers) => {
            const stickerResult = stickers.map(s => parseSticker(s)).sort(compareSticker);
            return okResult(res, stickerResult);
        })
        .catch((error) => {
            return badRequest(res, error.message.message);
        });
});

app.get('/api/stickers/:keyword', (req, res) => {
    stickerService
        .getByKeyword(keyword)
        .then((sticker) => {
            if (sticker) {
                return okResult(res, parseSticker(sticker));
            } else {
                return notFound(res, keyword);
            };
        })
        .catch((error) => {
            return badRequest(res, error.message.message);
        });
});

app.post('/api/stickers', ExpressJoi(stickerSchema), (req, res) => {
    imageService
        .upload(req.body.url)
        .then((imageUrl) => {
            if (!imageUrl) {
                return badRequest(res, 'Invalid image url');
            }

            return stickerService.add(req.body.keyword, imageUrl, req.body.upload.id, req.body.upload.username);
        })    
        .then((sticker) => {
            return created(res, sticker);
        })
        .catch((error) => {
            return badRequest(res, error.message.message);
        });
});

app.put('/api/stickers/:id', ExpressJoi(stickerSchema), (req, res) => {
    stickerService
        .update(req.params.id, req.body)
        .then((sticker) => {
            if (sticker) {
                okResult(res, parseSticker(sticker));
            }
            else {
                notFound(res, req.params.id);
            }
        })
        .catch((error) => {
            badRequest(res, error.message.message);
        });
});

app.delete('/api/stickers/:id', (req, res) => {
    stickerService
        .getById(req.params.id)
        .then((sticker) => {
            if (!sticker) {
                return notFound(req.params.id);
            }
            
            return stickerService.remove(req.params.id);
        })
        .then(() => {
            return res.status(204).send();
        })
        .catch((error) => {
            return badRequest(res, error.message.message);
        });
});

function okResult (res, result) {
    return res.status(200).send(responseResult.okResult(result));
}

function created (res, result) {
    return res.status(204).send(responseResult.created(result));
}

function badRequest (res, message) {
    return res.status(400).send(responseResult.badRequest(message));
}

function notFound (res, resourceKey) {
    return res.status(404).send(responseResult.notFound(resourceKey));
}

function parseSticker (sticker) {
    const result = {
        id: sticker._id,
        keyword: sticker.keyword,
        url: sticker.url,
        useCount: sticker.useCount,
        upload: sticker.upload
    };

    return result;
}

function compareSticker (stickerA, stickerB) {
    if (stickerA.keyword < stickerB.keyword) {
        return -1;
    } else if (stickerA.keyword > stickerB.keyword) {
        return 1;
    } else {
        return 0;
    }
}

const PORT = process.env.PORT || 8081
app.listen(PORT, () => console.log(`App is listening on port ${PORT}.`));
