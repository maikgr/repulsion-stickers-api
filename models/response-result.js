"use strict"
const moment = require('moment');

module.exports.okResult = function (data) {
    return {
        kind: 'VariableZ#stickers',
        code: 200,
        requestedAt: moment().format(),
        data: data
    }
}

module.exports.created = function (data) {
    return {
        kind: 'VariableZ#stickers',
        code: 201,
        requestedAt: moment().format(),
        data: data
    }
}

module.exports.badRequest = function (message) {
    return {
        code: 400,
        message: message
    }
}

module.exports.notFound = function (resourceKey) {
    return {
        code: 404,
        message: `There's no resource found for key ${resourceKey}.`
    }
}