'use strict';

// Exclude 0, o, and l to avoid confusion
const alphabet = '8JjMNkiLUtBvDF72QgEoapy3HZYu4zPWnAd6sqfcVbSmeX9C1xGRTrwKh5',
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

function _shuffle(array) {
    let index = array.length,
        temp,
        randIndex;

    while (0 !== index) {

        randIndex = Math.floor(Math.random() * index);
        index -= 1;

        temp = array[index];
        array[index] = array[randIndex];
        array[randIndex] = temp;
    }

    return array;
}

module.exports = {
    encode,
    decode,
    alphabet
}
