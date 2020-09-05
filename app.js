const { app, BrowserWindow, ipcMain, remote } = require('electron')
const path = require('path')
//const fs = require('fs')

function createWindow() {
    let win = new BrowserWindow({
        width: 480,
        height: 490,
        resizable: false,
        title: '학급 정부회장 선거',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.setMenu(null)
    
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
    let win = BrowserWindow.getFocusedWindow()

    switch (arg.type) {
        case 'reload':
            win.reload()
            break
        case 'title':
            win.setTitle(arg.data)
            break
        case 'quit':
            app.quit()
            break
        case 'resizeable':
            win.setResizable(arg.data)
            break
        case 'maximize':
            win.maximize()
            break
        case 'fullscreen':
            win.setFullScreen(arg.data)
            break
    }
})

app.whenReady().then(createWindow)