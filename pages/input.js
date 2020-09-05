const { ipcRenderer } = require('electron')

ipcRenderer.send('app', {type: "title", data: "학급 정부회장 선거 - 후보자 등록"})
ipcRenderer.send('app', {type: "resizeable", data: true})
ipcRenderer.send('app', {type: "maximize"})

window.onload = function() {
    document.body.style.opacity = '1'
}