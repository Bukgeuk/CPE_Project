const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
//const fs = require('fs-extra')

let candidateList = []
let option = {}
let haveToUpdate = undefined

function createWindow() {
    let win = new BrowserWindow({
        width: 480,
        height: 490,
        resizable: false,
        title: '학급 정부회장 선거',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    win.setMenu(null)

    //win.webContents.openDevTools()
    
    win.loadFile('pages/start.html')

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('data', (event, arg) => {
    switch (arg.type) {
        case 'listToMainProcess':
            candidateList = arg.data
            break
        case 'listToRendererProcess':
            event.sender.send('data', {type: 'list', data: candidateList})
            break
        case 'optionToMainProcess':
            option = arg.data
            break
        case 'optionToRendererProcess':
            event.sender.send('data', {type: 'option', data: option})
            break
        case 'updateToMainProcess':
            haveToUpdate = arg.data
            break
        case 'updateToRendererProcess':
            event.sender.send('data', {type: 'update', data: haveToUpdate})
            break

    }
})

ipcMain.on('modal', (event, arg) => {
    let win = BrowserWindow.getFocusedWindow()
    let modal = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        width: 420,
        height: 420,
        resizable: false,
        icon: path.join(__dirname, 'assets', 'icons', `${(() => {if (arg.type === "update") return arg.type; else return (arg.type + "_modal")})()}.png`),
        title: `${(() => {if (arg.type === "fail") return "네트워크 오류"; else if (arg.type === "update") return "업데이트 필요"; else if (arg.type === "updated") return "업데이트 필요 없음"})()}`,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    modal.setMenu(null)
    modal.loadFile('pages/modal.html', {query: {status: arg.type, lastest: arg.lastest}})
    //modal.webContents.openDevTools(true)
    
    modal.once('ready-to-show', () => {
        modal.show()
    })
})

app.whenReady().then(createWindow)