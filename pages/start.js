const { ipcRenderer, shell } = require('electron')

window.onload = () => {
    document.body.style.opacity = '1'
}

function openGitHub() {
    shell.openExternal("https://github.com/Bukgeuk/CPE_Project")
}

function clickNext() {
    setTimeout(() => {
        location.href = './input.html'
    }, 200)

    document.body.style.opacity = '0'
}

function clickExit() {
    ipcRenderer.send('app', {type: "quit"})
}