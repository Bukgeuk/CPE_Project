const { remote, ipcRenderer } = require('electron')

let candidateList = []
let canPageMove = false

ipcRenderer.on('data', (event, arg) => {
    if (arg.type === 'list') 
        candidateList = arg.data
})

ipcRenderer.send('data', ({type: 'listToRendererProcess'}))

window.onload = () => {
    document.body.style.opacity = '1'

    let target = document.getElementById('scrollView')

    let namelist = new Array()
    candidateList.forEach(item => {
        namelist.push(item.name)
    })

    for (let i = 0; i < namelist.length; i++) {
        let div = document.createElement('div')
        div.id = `voteDiv${i}`

        let innerDiv = document.createElement('div')
        innerDiv.classList.add('inline-block')

        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.innerText = `${i + 1}번`

        let p = document.createElement('p')
        p.classList.add('text', 'light-text')
        p.innerText = `${namelist[i]}`

        innerDiv.appendChild(span)
        innerDiv.appendChild(p)

        let span2 = document.createElement('span')
        span2.classList.add('text', 'medium-text')
        span2.innerText = "0표"
        span2.id = `voteSpan${i}`

        div.appendChild(innerDiv)
        div.appendChild(span2)

        target.appendChild(div)
    }

    count()
}

async function count(list, name) {
    let pointArr = []
    let pointIdx = 0
    let isSurvive = []

    for (let i = 0; i < candidateList.length; i++) {
        pointArr.push(candidateList[i].value)
        isSurvive.push(true)
    }

    pointArr = Array.from(new Set(pointArr))
    pointArr.sort((a, b) => a - b)

    for (let i = 0; i < pointArr[pointArr.length - 1] + 1; i++) {
        if (i === (pointArr[pointIdx] + 1)) {
            for (let j = 0; j < candidateList.length; j++) {
                if (!isSurvive[j]) continue

                if (candidateList[j].value === pointArr[pointIdx]) {
                    isSurvive[j] = false

                    setFail(j)
                    // 탈락
                } else {
                    document.getElementById(`voteSpan${j}`).innerText = `${i}표`
                }
            }

            pointIdx++
        } else {
            for (let j = 0; j < candidateList.length; j++) {
                if (!isSurvive[j]) continue

                document.getElementById(`voteSpan${j}`).innerText = `${i}표`

                /*let audio = new Audio()
                audio.src = "../assets/audios/test.mp3"
                audio.play()*/
            }
        }

        await sleep(1000)
    }

    document.getElementById('next').classList.remove('cursor-not-allowed', 'opacity-50')

    canPageMove = true
}

function setFail(number) {
    let div = document.getElementById(`voteDiv${number}`)
    //let span = document.getElementById(`voteSpan${number}`)

    div.classList.add('opacity-50')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function clickNext() {
    if (!canPageMove) return

    let win = remote.getCurrentWindow()
    win.setTitle("학급 정부회장 선거 - 결과")
    win.setFullScreen(false)
    win.maximize()
    win.setResizable(false)

    setTimeout(() => {
        location.href = './result.html'
    }, 200)

    document.body.style.opacity = '0'
}