"use strict"

class ErrorResult {
    constructor (message, code = 400) {
        this.code = code;
        this.message = message;
    }
}

module.exports.ErrorResult = ErrorResult;