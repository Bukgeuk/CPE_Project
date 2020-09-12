const { shell, remote, ipcRenderer } = require('electron')
const fs = require('fs-extra')
const https = require('https')

let bHaveToUpdate = undefined

ipcRenderer.on('data', (event, arg) => {
    if (arg.type === 'update') {
        bHaveToUpdate = arg.data
    }
})

ipcRenderer.send('data', {type: 'updateToRendererProcess'})

window.onload = () => {
    document.body.style.opacity = '1'

    const version = getCurrentVersion()
    document.getElementById('version').innerText = `Version ${version}`

    let update = document.getElementById('update')

    if (bHaveToUpdate === undefined) {
        getLastestVersion().then(lastestVersion => {
            bHaveToUpdate = haveToUpdate(version, lastestVersion)

            if (bHaveToUpdate) {
                update.src = '../assets/icons/update.png'
            } else {
                update.src = '../assets/icons/updated.png'
            }

            ipcRenderer.send('data', {type: 'updateToMainProcess', data: bHaveToUpdate})
        }).catch(err => {
            update.src = '../assets/icons/fail.png'
        })
    } else if (bHaveToUpdate === true) {
        update.src = '../assets/icons/update.png'
    } else if (bHaveToUpdate === false) {
        update.src = '../assets/icons/updated.png'
    }
}

function openGitHub() {
    shell.openExternal("https://github.com/Bukgeuk/CPE_Project")
}

function clickNext() {
    setTimeout(() => {
        location.href = './input.html?from=start'
    }, 200)

    document.body.style.opacity = '0'
}

function clickExit() {
    remote.app.quit()
}

function getLastestVersion(){
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
        }).on('error', e => reject(e))
    })
}

function getCurrentVersion() {
    const obj = fs.readJsonSync('./version.json')
    return obj.version
}

function haveToUpdate(current, lastest){
    let beta = false

    if (lastest.indexOf('b') !== -1) return false

    if (current.indexOf('b') !== -1) {
        current = current.replace('b', '')
        beta = true
    }
    
    const currentArr = current.split('.')
    const lastestArr = lastest.split('.')

    for (let i = 0; i < 3; i++) {
        if (parseInt(currentArr[i]) < parseInt(lastestArr[i])) return true
        else if (parseInt(currentArr[i]) > parseInt(lastestArr[i])) return false
    }

    if (beta) return true
    else return false
}