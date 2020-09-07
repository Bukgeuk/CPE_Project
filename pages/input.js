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

let win = remote.getCurrentWindow()
win.setTitle("학급 정부회장 선거 - 후보자 등록")

//ipcRenderer.send('app', {type: "title", data: "학급 정부회장 선거 - 후보자 등록"})
//ipcRenderer.send('app', {type: "resizeable", data: true})

let isFocusedInput = false
let next = 6
let candidateList = []
let mouseOverEventHandlers = []
let mouseOutEventHandlers = []
let clickEventHandlers = []
let focusEventHandlers = []
let blurEventHandlers = []
let option = {}

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

if (getQueryString().from === 'start') {
    win.setResizable(true)
    win.blur()
    win.focus()
    //win.maximize()
    win.setFullScreen(true)
    //ipcRenderer.send('app', {type: "hangul"})
}

ipcRenderer.send('data', {type: 'listToRenderingProcess'})
ipcRenderer.send('data', {type: 'optionToRenderingProcess'})

document.addEventListener('keypress', (e) => {
    if (e.key === '+' && !isFocusedInput)
        addInput()
    else if (e.key === '-' && !isFocusedInput)
        deleteInput(next - 2)
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete')
        deleteInput(next - 2)
})

window.onload = function() {
    document.body.style.opacity = '1'

    let target = document.getElementById('scrollView')

    for (let i = 0; i < 5; i++) {
        const argValue = i

        function mouseoverHandler() {
            onMouseOver(argValue)
        }

        function mouseoutHandler() {
            onMouseOut(argValue)
        }

        function clickHandler() {
            deleteInput(argValue)
        }

        function focusHandler() {
            isFocusedInput = true
        }

        function blurHandler() {
            isFocusedInput = false
        }

        mouseOverEventHandlers.push(mouseoverHandler)
        mouseOutEventHandlers.push(mouseoutHandler)
        clickEventHandlers.push(clickHandler)
        focusEventHandlers.push(focusHandler)
        blurEventHandlers.push(blurHandler)

        let div = document.createElement('div')
        div.addEventListener('mouseover', mouseoverHandler)
        div.addEventListener('mouseout', mouseoutHandler)

        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.innerText = `${i + 1}번`

        let input = document.createElement('input')
        input.classList.add('focus:outline-none', 'focus:shadow-outline', 'rounded-lg', 'px-3', 'appearance-none', 'leading-normal', 'input', 'border', 'text', 'light-text')
        input.type = 'text'
        input.placeholder = '이름 입력'
        input.id = `inputName${i}`
        input.addEventListener('focus', focusHandler)
        input.addEventListener('blur', blurHandler)

        let img = document.createElement('img')
        img.src = "../assets/icons/close.png"
        img.width = '15'
        img.height = '15'
        img.id = `img${i}`
        img.addEventListener('click', clickHandler)

        div.appendChild(span)
        div.appendChild(input)
        div.appendChild(img)

        target.appendChild(div)

        /*target.innerHTML += `
        <div onmouseover="onMouseOver(${i})" onmouseout="onMouseOut(${i})">
            <span class="medium-text text">${i + 1}번</span>
            <input class="focus:outline-none focus:shadow-outline rounded-lg px-3 appearance-none leading-normal input border text light-text" type="text" placeholder="이름 입력" id="inputName${i}">
            <img src="../assets/icons/close.png" width="15" height="15" id="img${i}" onclick="deleteInput(${i})">
        </div>`*/
    }

    { // Add Button
        let div = document.createElement('div')
        div.id = "addInputDiv"
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.style.visibility = 'hidden'
        span.innerText = `${next}번`
    
        let button = document.createElement('button')
        button.classList.add('tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-blue-500', 'text-blue-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-blue-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', addInput)
        button.id = "addInput"
        button.innerText = "추가"
    
        div.appendChild(span)
        div.appendChild(button)
    
        target.appendChild(div)
    }

    { // Delete Button
        let div = document.createElement('div')
        div.id = "deleteInputDiv"
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.style.visibility = 'hidden'
        span.innerText = `${next}번`
    
        let button = document.createElement('button')
        button.classList.add('tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-red-500', 'text-red-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-red-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', () => { deleteInput(next - 2) })
        button.id = "deleteInput"
        button.innerText = "삭제"
    
        div.appendChild(span)
        div.appendChild(button)
    
        target.appendChild(div)
    }

    /*target.innerHTML += `
    <div id="addInputDiv">
        <span class="medium-text text" style="visibility: hidden;">${next}번</span>
        <button class="text tracking-wide bold-text bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onclick="addInput()" id="addInput">추가</button>
    </div>`*/

    if (Object.keys(option).length !== 0) {
        document.getElementById('inputHeadCount').value = option.headcount
        document.getElementById('useAbstain').checked = option.useAbstain

        if (option.votingMethod === 'mouse')
            document.getElementById('mouseRadio').checked = true
        else if (option.votingMethod === 'keyboard')
            document.getElementById('keyboardRadio').checked = true
    }

    if (candidateList.length > 0) {
        for (let i = 0; i < candidateList.length; i++) {
            if (i > 4)
                addInput()
            document.getElementById(`inputName${i}`).value = candidateList[i].name
        }
    }
}

function addInput() {
    let target = document.getElementById('scrollView')
    
    document.getElementById('addInputDiv').remove()
    document.getElementById('deleteInputDiv').remove()

    {
        const argValue = next - 1

        function mouseoverHandler() {
            onMouseOver(argValue)
        }

        function mouseoutHandler() {
            onMouseOut(argValue)
        }

        function clickHandler() {
            deleteInput(argValue)
        }

        function focusHandler() {
            isFocusedInput = true
        }

        function blurHandler() {
            isFocusedInput = false
        }

        mouseOverEventHandlers.push(mouseoverHandler)
        mouseOutEventHandlers.push(mouseoutHandler)
        clickEventHandlers.push(clickHandler)
        focusEventHandlers.push(focusHandler)
        blurEventHandlers.push(blurHandler)

        let div = document.createElement('div')
        div.addEventListener('mouseover', mouseoverHandler)
        div.addEventListener('mouseout', mouseoutHandler)
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.innerText = `${next}번`
    
        let input = document.createElement('input')
        input.classList.add('focus:outline-none', 'focus:shadow-outline', 'rounded-lg', 'px-3', 'appearance-none', 'leading-normal', 'input', 'border', 'text', 'light-text')
        input.type = 'text'
        input.placeholder = '이름 입력'
        input.id = `inputName${next - 1}`
        input.addEventListener('focus', focusHandler)
        input.addEventListener('blur', blurHandler)
    
        let img = document.createElement('img')
        img.src = "../assets/icons/close.png"
        img.width = '15'
        img.height = '15'
        img.id = `img${next - 1}`
        img.addEventListener('click', clickHandler)
    
        div.appendChild(span)
        div.appendChild(input)
        div.appendChild(img)
    
        target.appendChild(div)
    }

    /*target.innerHTML += `
    <div onmouseover="onMouseOver(${next - 1})" onmouseout="onMouseOut(${next - 1})">
        <span class="medium-text text">${next}번</span>
        <input class="focus:outline-none focus:shadow-outline rounded-lg px-3 appearance-none leading-normal input border text light-text" type="text" placeholder="이름 입력" id="inputName${next - 1}">
        <img src="../assets/icons/close.png" width="15" height="15" id="img${next - 1}" onclick="deleteInput(${next - 1})">
    </div>`*/

    {
        let div = document.createElement('div')
        div.id = "addInputDiv"
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.style.visibility = 'hidden'
        span.innerText = `${next}번`
    
        let button = document.createElement('button')
        button.classList.add('tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-blue-500', 'text-blue-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-blue-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', addInput)
        button.id = "addInput"
        button.innerText = "추가"
    
        div.appendChild(span)
        div.appendChild(button)
    
        target.appendChild(div)
    }

    { // Delete Button
        let div = document.createElement('div')
        div.id = "deleteInputDiv"
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.style.visibility = 'hidden'
        span.innerText = `${next}번`
    
        let button = document.createElement('button')
        button.classList.add('tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-red-500', 'text-red-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-red-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', () => { deleteInput(next - 2) })
        button.id = "deleteInput"
        button.innerText = "삭제"
    
        div.appendChild(span)
        div.appendChild(button)
    
        target.appendChild(div)
    }

    /*target.innerHTML += `
    <div id="addInputDiv">
        <span class="medium-text text" style="visibility: hidden;">${next}번</span>
        <button class="text tracking-wide bold-text bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onclick="addInput()" id="addInput">추가</button>
    </div>`*/

    next++

    let elem = document.getElementsByTagName('section')[0]
    elem.scrollTop = elem.scrollHeight
}

function clickNext() {
    let flag1 = false
    let flag2 = false

    candidateList = []

    for (let i = 0; i < next - 1; i++) {
        let name = document.getElementById(`inputName${i}`).value

        if (name) {
            flag1 = true
            candidateList.push({name: name, value: 0})
        } else {
            if (i + 1 !== next - 1 && document.getElementById(`inputName${i + 1}`).value)
                flag2 = true
        }
    }

    if (!flag1) {
        toastr.error("", "후보자를 입력해 주세요")

        return
    }

    if (flag2) {
        let win = remote.getCurrentWindow()

        remote.dialog.showMessageBoxSync(win, {type: 'warning', title: '경고', message: '중간에 입력되지 않은 번호가 있습니다', detail: '자동으로 앞으로 당겨져서 기입됩니다'})
    }

    let headcount = document.getElementById('inputHeadCount').value

    if (!headcount) {
        toastr.error("", "투표자 수를 입력해 주세요")

        return
    }

    option.headcount = parseInt(headcount)
    option.useAbstain = document.getElementById('useAbstain').checked
    option.votingMethod = getVotingMethod()

    ipcRenderer.send('data', {type: 'listToMainProcess', data: candidateList})
    ipcRenderer.send('data', {type: 'optionToMainProcess', data: option})

    win = remote.getCurrentWindow()

    setTimeout(() => {
        win.setTitle("학급 정부회장 선거 - 투표")
        //ipcRenderer.send('app', ({type: 'title', data: '학급 정부회장 선거 - 투표'}))
        location.href = './vote.html'
    }, 200)

    document.body.style.opacity = '0'
}

function clickCancel() {
    ipcRenderer.send('data', {type: 'listToMainProcess', data: []})
    ipcRenderer.send('data', {type: 'optionToMainProcess', data: {}})

    win = remote.getCurrentWindow()

    setTimeout(() => {
        win.setTitle("학급 정부회장 선거")
        win.setSize(480, 490)
        win.setFullScreen(false)
        //win.unmaximize()
        win.setResizable(false)
        /*ipcRenderer.send('app', ({type: 'title', data: '학급 정부회장 선거'}))
        ipcRenderer.send('app', {type: "size", data: {width: 480, height: 490}})
        ipcRenderer.send('app', {type: "fullscreen", data: false})
        ipcRenderer.send('app', {type: "unmaximize"})
        ipcRenderer.send('app', {type: "resizeable", data: false})*/
        location.href = './start.html'
    }, 200)

    document.body.style.opacity = '0'
}

function getVotingMethod() {
    let mouse = document.getElementById('mouseRadio').checked
    let keyboard = document.getElementById('keyboardRadio').checked

    if (mouse && !keyboard) return 'mouse'
    else if (!mouse && keyboard) return 'keyboard'
    else return 'error'
}

function onMouseOver(number) {
    document.getElementById(`img${number}`).style.visibility = 'visible'
}

function onMouseOut(number) {
    document.getElementById(`img${number}`).style.visibility = 'hidden'
}

function deleteInput(number) {
    if (number === -1) return

    document.getElementById(`inputName${number}`).parentElement.remove()

    next--

    for (let i = number; i < next - 1; i++) {
        const argValue = i

        let input = document.getElementById(`inputName${i + 1}`)
        let div = input.parentElement
        let span = div.firstElementChild
        let img = document.getElementById(`img${i + 1}`)

        input.id = `inputName${i}`

        function mouseoverHandler() {
            onMouseOver(argValue)
        }

        function mouseoutHandler() {
            onMouseOut(argValue)
        }

        function clickHandler() {
            deleteInput(argValue)
        }

        function focusHandler() {
            isFocusedInput = true
        }

        function blurHandler() {
            isFocusedInput = false
        }

        mouseOverEventHandlers[i] = mouseoverHandler
        mouseOutEventHandlers[i] = mouseoutHandler
        clickEventHandlers[i] = clickHandler
        focusEventHandlers[i] = focusHandler
        blurEventHandlers[i] = blurHandler

        div.removeEventListener('mouseover', mouseOverEventHandlers[i + 1])
        div.addEventListener('mouseover', mouseoverHandler)
        div.removeEventListener('mouseout', mouseOutEventHandlers[i + 1])
        div.addEventListener('mouseout', mouseoutHandler)

        span.innerText = `${i + 1}번`

        input.removeEventListener('focus', focusEventHandlers[i + 1])
        input.addEventListener('focus', focusHandler)
        input.removeEventListener('blur', blurEventHandlers[i + 1])
        input.addEventListener('blur', blurHandler)

        img.id = `img${i}`
        img.removeEventListener('click', clickEventHandlers[i + 1])
        img.addEventListener('click', clickHandler)
    }

    document.getElementById('addInputDiv').firstElementChild.innerText = `${next - 1}번`
    document.getElementById('deleteInputDiv').firstElementChild.innerText = `${next - 1}번`

    mouseOverEventHandlers.pop()
    mouseOutEventHandlers.pop()
    clickEventHandlers.pop()
}

function getQueryString(){
    let result = {}
    let arguments = window.location.href.indexOf('?')

    if (arguments === -1) return null

    let arr = window.location.href.substr(arguments + 1).split('&');

    for(let i = 0; i < arr.length; i++){
        let temp = arr[i].split('=');
        result[temp[0]] = temp[1]
    }

    return result;
}

function checkNum(e) {
    let keyVal = e.keyCode

    return (keyVal >= 48 && keyVal <= 57)
}