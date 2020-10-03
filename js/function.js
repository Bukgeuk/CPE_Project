const fs = require('fs-extra')

function getQueryString(){
    let result = {}
    let arguments = window.location.href.indexOf('?')

    if (arguments === -1) return null

    let arr = window.location.href.substr(arguments + 1).split('&');

    for(let i = 0; i < arr.length; i++){
        let temp = arr[i].split('=');
        result[temp[0]] = temp[1]
    }

    return result;
}

function getCurrentVersion() {
    const obj = fs.readJsonSync('./version.json')
    return obj.version
}