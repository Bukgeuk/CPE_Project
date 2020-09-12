const { remote, ipcRenderer, clipboard, nativeImage } = require('electron')
const fs = require('fs-extra')
window.$ = window.jQuery = require('jquery')
window.toastr = require('toastr')
window.html2canvas = require('html2canvas')

toastr.options = {
    //"escapeHtml" : true,
    "closeButton" : true,
    "newestOnTop" : false,
    "progressBar": true,
    "timeOut" : 2000,
    "showDuration": 300,
    "hideDuration": 1000,
    "positionClass": "toast-bottom-left",
}

let candidateList = []

ipcRenderer.on('data', (event, arg) => {
    if (arg.type === 'list')
            candidateList = arg.data
})

ipcRenderer.send('data', {type: 'listToRendererProcess'})

window.onload = () => {
    document.body.style.opacity = '1'

    let valueArr = []

    for (let i = 0; i < candidateList.length; i++) {
        valueArr.push(candidateList[i].value)
    }

    valueArr = Array.from(new Set(valueArr))
    valueArr.sort((a, b) => b - a)

    let firstPlace = []
    let secondPlace = []

    for (let i = 0; i < candidateList.length; i++) {
        if (candidateList[i].value === valueArr[0])
            firstPlace.push(candidateList[i].name)
        else if (candidateList[i].value === valueArr[1])
            secondPlace.push(candidateList[i].name)
    }

    if (firstPlace.length > 0)
        document.getElementById('1stPlace').innerText = firstPlace.join(', ')
    if (secondPlace.length > 0)
        document.getElementById('2ndPlace').innerText = secondPlace.join(', ')

    let target = document.getElementById('scrollView')

    for (let i = 0; i < candidateList.length; i++) {
        let div = document.createElement('div')

        let innerDiv = document.createElement('div')
        innerDiv.classList.add('inline-block')

        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.innerText = `${i + 1}번`

        let p = document.createElement('p')
        p.classList.add('text', 'light-text')
        p.innerText = `${candidateList[i].name}`

        innerDiv.appendChild(span)
        innerDiv.appendChild(p)

        let span2 = document.createElement('span')
        span2.classList.add('text', 'medium-text')
        span2.innerText = `${candidateList[i].value}표`

        div.appendChild(innerDiv)
        div.appendChild(span2)

        target.appendChild(div)
    }
}

function clickCopy() { // 복사
    html2canvas(document.querySelector("#scrollView"), {
        backgroundColor: "#45474a"
    }).then(canvas => {
        clipboard.writeImage(nativeImage.createFromDataURL(canvas.toDataURL("image/png")))
    })
}

function clickSave() { // 저장
    html2canvas(document.querySelector("#scrollView"), {
        backgroundColor: "#45474a"
    }).then(canvas => {
        const path = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
            title: "저장",
            filters: [
                {name: 'PNG 파일', extensions: ['png']},
                {name: 'JPEG 파일', extensions: ['jpeg']}
              ]
        })

        let extension = path.substr(path.lastIndexOf('.') + 1)

        if (extension === 'png')
            fs.writeFileSync(path, nativeImage.createFromDataURL(canvas.toDataURL("image/png")).toPNG())
        else if (extension === 'jpeg')
            fs.writeFileSync(path, nativeImage.createFromDataURL(canvas.toDataURL("image/jpeg")).toJPEG(90))
    })
}

function clickNext() {
    ipcRenderer.send('data', {type: 'listToMainProcess', data: []})
    ipcRenderer.send('data', {type: 'optionToMainProcess', data: {}})

    let win = remote.getCurrentWindow()
    win.setTitle("학급 정부회장 선거")
    win.setResizable(true)
    win.setSize(480, 490)
    win.unmaximize()

    setTimeout(() => {
        location.href = './start.html'
    }, 200)

    document.body.style.opacity = '0'
}