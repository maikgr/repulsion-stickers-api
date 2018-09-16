"use strict"
const moment = require('moment');

class SuccessResult {
    constructor (data) {
        this.kind = 'VariableZ#stickers';
        this.code = 200;
        this.requestedAt = moment().format();
        this.data = data;
    }
}

module.exports.SuccessResult = SuccessResult;