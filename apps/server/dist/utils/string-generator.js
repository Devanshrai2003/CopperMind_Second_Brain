"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = generateRandomString;
function generateRandomString(length) {
    let randomString = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let count = 0;
    while (count < length) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        count += 1;
    }
    return randomString;
}
