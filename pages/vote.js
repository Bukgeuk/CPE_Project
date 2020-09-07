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
let option = {}
let count = 0
let canVote = true
const keyList = [
                '1', '2', '3', '4', '5', '6', '7',
                '8', '9', 'a', 'b', 'c', 'd', 'e',
                'f', 'g', 'h', 'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p', 'q', 'r', 's',
                't', 'u', 'v', 'w', 'x', 'y', 'z'
                ]

ipcRenderer.on('data', (event, arg) => {
    switch(arg.type) {
        case 'list':
            candidateList = arg.data
            break
        case 'option':
            option = arg.data
            break
    }
})

ipcRenderer.send('data', ({type: 'listToRenderingProcess'}))
ipcRenderer.send('data', ({type: 'optionToRenderingProcess'}))

window.onload = () => {
    document.body.style.opacity = '1'

    let target = document.getElementById('scrollView')

    let namelist = new Array()
    candidateList.forEach(item => {
        namelist.push(item.name)
    })

    if (option.useAbstain) {
        let div = document.createElement('div')

        let innerDiv = document.createElement('div')
        innerDiv.classList.add('inline-block')

        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.innerText = "0번"
        span.style.visibility = 'hidden'

        let p = document.createElement('p')
        p.classList.add('text', 'medium-text')
        p.innerText = "기권"

        innerDiv.appendChild(span)
        innerDiv.appendChild(p)
        div.appendChild(innerDiv)

        if (option.votingMethod === 'mouse')
            div.innerHTML += `<button class="tracking-wide bold-text bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" onclick="vote(null)">투표하기</button>`
        else if (option.votingMethod === 'keyboard') {
            let span = document.createElement('span')
            span.classList.add('text', 'medium-text')
            span.innerText = "0키"

            div.appendChild(span)
        }

        target.appendChild(div)
    }

    for (let i = 0; i < namelist.length; i++) {
        let div = document.createElement('div')

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
        div.appendChild(innerDiv)

        if (option.votingMethod === 'mouse')
            div.innerHTML += `<button class="tracking-wide bold-text bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" onclick="vote(${i})">투표하기</button>`
        else if (option.votingMethod === 'keyboard') {
            let span = document.createElement('span')
            span.classList.add('text', 'medium-text')
            span.innerText = `${keyList[i]}키`

            div.appendChild(span)
        }

        target.appendChild(div)

        /*<div>
            <div class="inline-block">
                <span class="medium-text text">1번</span>
                <p class="text light-text">홍길동</p>
            </div>
            <button class="tracking-wide bold-text bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" onclick="vote(0)">투표하기</button>
        </div>*/
    }

    document.getElementById('voteCount').innerText = `남은 투표자 : ${option.headcount}명`

    if (option.votingMethod === 'keyboard') {
        document.addEventListener('keypress', (e) => {
            if (option.headcount <= count) return

            if (e.key === '0') {
                vote(null)
                return
            }

            let idx = keyList.findIndex((item) => { return item === e.key })
            vote(idx)
        })
    }
}

function clickBack() {
    setTimeout(() => {
        location.href = './input.html?from=vote'
    }, 200)

    document.body.style.opacity = '0'
}

function clickNext() {
    let win = remote.getCurrentWindow()
    win.setTitle("학급 정부회장 선거 - 개표")
    win.setFullScreen(false)
    win.maximize()
    win.setResizable(false)

    setTimeout(() => {
        location.href = './count.html'
    }, 200)

    document.body.style.opacity = '0'
}

function setVoteCountText() {
    document.getElementById('voteCount').innerText = `남은 투표자 : ${option.headcount - count}명`
}

function vote(number) {
    if (!canVote) {
        toastr.info("", "잠시 기다려 주세요")
        // show toast message

        return
    }

    if (count === 0) {
        let btn = document.getElementById('back')
        btn.onclick = ''
        btn.classList.add('cursor-not-allowed', 'opacity-50')
    }

    if (number !== null)
        candidateList[number].value++
    
    count++
    setVoteCountText()
    toastr.success("", "투표되었습니다!")
    // show toast message

    if (option.headcount === count) {
        let sv = document.getElementById('scrollView')

        for (let i = 0; i < sv.childElementCount; i++) {
            let child = sv.children[i].lastElementChild
            child.classList.add('cursor-not-allowed', 'opacity-50')
            child.classList.remove('hover:bg-green-500', 'hover:text-white', 'hover:border-transparent')
            child.onclick = ''
        }

        let btn = document.getElementById('next')
        btn.addEventListener('click', clickNext)
        btn.classList.remove('cursor-not-allowed', 'opacity-50')
    } else {
        setCanVote(false)
        setTimeout(() => {
            setCanVote(true)
        }, 2000)
    }
}

function setCanVote(value) {
    if (value) {
        canVote = true

        let sv = document.getElementById('scrollView')

        for (let i = 0; i < sv.childElementCount; i++) {
            let child = sv.children[i].lastElementChild
            child.classList.remove('cursor-not-allowed', 'opacity-50')

            if (option.votingMethod === 'mouse')
                child.classList.add('hover:bg-green-500', 'hover:text-white', 'hover:border-transparent')
        }
    } else {
        canVote = false

        let sv = document.getElementById('scrollView')

        for (let i = 0; i < sv.childElementCount; i++) {
            let child = sv.children[i].lastElementChild
            child.classList.add('cursor-not-allowed', 'opacity-50')

            if (option.votingMethod === 'mouse')
                child.classList.remove('hover:bg-green-500', 'hover:text-white', 'hover:border-transparent')
        }
    }
}