'use strict';

// Exclude 0, o, and l to avoid confusion
const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
      base     = alphabet.length;

// Convert base10 int to base58 str
function encode(num){
    let encoded = '';
    while (num){
        let remainder = num % base;
        num = Math.floor(num / base);
        encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
}

// Convert base58 str to base10 int
function decode(str){
    let decoded = 0;
    while (str){
        let index = alphabet.indexOf(str[0]),
            power = str.length - 1;
        decoded += index * Math.pow(base, power);
        str = str.substring(1);
    }
    return decoded;
}

module.exports = {
    encode,
    decode
}
