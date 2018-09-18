const imgur = require('imgur');

const albumId = 'V7qYbqX';

imgur.setCredentials(process.env.IMGUR_ID, process.env.IMGUR_PASSWORD, process.env.IMGUR_CLIENTID);

module.exports.upload = async function (url) {
    try {
        const json = await imgur.uploadFile(url, albumId);

        if (json.success) {
            return json.data.link;
        }

        return undefined;
    } catch (error) {
        return undefined;
    }
}