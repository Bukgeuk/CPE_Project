const { ipcRenderer } = require('electron')

let candidateList = []

ipcRenderer.on('sendList', (event, arg) => {
    candidateList = arg
})

ipcRenderer.send('app', ({type: 'sendList'}))

window.onload = function() {
    document.body.style.opacity = '1'

    let target = document.getElementById('scrollView')

    let namelist = new Array()
    candidateList.forEach(item => {
        namelist.push(item.name)
    })

    for (let i = 0; i < namelist.length; i++) {
        target.innerHTML += `
        <div>
            <span class="medium-text text">${i + 1}번</span>
            <p class="text light-text">${namelist[i]}</p>
        </div>`
    }
}