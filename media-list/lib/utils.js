'use strict'

var utils = module.exports = {};

/**
 * Sleeps the process using a promise
 * 
 * @param {int} ms 
 */
utils.sleep = function(ms) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
};

/**
 * Escapes double quotes in strings so it doesn't break
 * 
 */
utils.xsDQ = function(stringToEscape) {
    return stringToEscape.replace(/"/g,'\\\"');
}