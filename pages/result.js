const { remote, ipcRenderer } = require('electron')
window.$ = window.jQuery = require('jquery')
window.toastr = require('toastr')

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

    document.getElementById('1stPlace').innerText = firstPlace.join(', ')
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