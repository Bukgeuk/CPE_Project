const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
//const fs = require('fs')

let candidateList = []
let option = {}

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

    win.webContents.openDevTools()
    
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

ipcMain.on('app', (event, arg) => {
    switch (arg.type) {
        case 'quit':
            app.quit()
            break
        case 'getList':
            candidateList = arg.data
            break
        case 'sendList':
            event.sender.send('sendList', candidateList)
            break
    }
})

ipcMain.on('data', (event, arg) => {
    switch (arg.type) {
        case 'listToMainProcess':
            candidateList = arg.data
            break
        case 'listToRenderingProcess':
            event.sender.send('data', {type: 'list', data: candidateList})
            break
        case 'optionToMainProcess':
            option = arg.data
            break
        case 'optionToRenderingProcess':
            event.sender.send('data', {type: 'option', data: option})
            break
    }
})

app.whenReady().then(createWindow)