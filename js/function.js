const https = require("https")
const fs = require("fs-extra")

function sort(arr) {
    arr.sort((a, b) => { 
        if (a.value < b.value)
            return 1
        else if (a.value > b.value)
            return -1
        else
            return 0
    })
}

function count(list, name) {
    let count = 0
    let array = []

    for (let i = 0; i < list.length; i++)
        array.push(list[i].value)

    array.sort()

    
}

function versionCheck(){
    const url = "https://raw.githubusercontent.com/Bukgeuk/CPE_Project/master/version.json"

    return new Promise((resolve, reject) => {
        https.get(url, stream => {
            let rawdata = ''
            stream.setEncoding('utf8')
            stream.on('data', buffer => rawdata += buffer)
            stream.on('end', () => {
                try {
                    const obj = JSON.parse(rawdata)
                    resolve(obj.version)
                } catch (e) {
                    reject(e)
                }
            })
        }).on('error', (e) => reject(e))
    })
}