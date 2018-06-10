'use strict';

module.exports = function redirectInQueryString(url){
    const exp = /\?|&redirect/i;
    return exp.test(url);
}
