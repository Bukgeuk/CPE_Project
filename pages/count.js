const { remote, ipcRenderer } = require('electron')

let candidateList = []
let canPageMove = false

ipcRenderer.on('data', (event, arg) => {
    if (arg.type === 'list') 
        candidateList = arg.data
})

ipcRenderer.send('data', ({type: 'listToRendererProcess'}))

window.onload = async () => {
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

    await effect()
    count()
}

function effect() {
    return new Promise(async (resolve, reject) => {
        await sleep(10)

        for (let i = 3; i >= 1; i--) {
            let obj = document.getElementById(`count${i}`)
            obj.style.display = 'inherit'
    
            for (let j = 25; j >= 20; j -= 0.05) {
                obj.style.fontSize = `${j}vw`
                await sleep(1)
            }
    
            await sleep(500)
    
            for (let j = 1; j >= 0; j -= 0.01) {
                obj.style.opacity = j
    
                await sleep(1)
            }
    
            await sleep(200)
    
            obj.style.display = 'none'
        }

        let background = document.getElementById('count')
        for (let i = 1; i >= 0; i -= 0.01) {
            background.style.opacity = i

            await sleep(1)
        }
        background.style.display = 'none'

        resolve()
    })
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

    let audio = new Audio()
    audio.src = "../assets/audios/count.wav"
                
    let flag = true

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
            }
        }

        if (flag) flag = false
        else audio.play()

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
        location.href = `./result.html?abstain=${getQueryString().abstain}`
    }, 200)

    document.body.style.opacity = '0'
}