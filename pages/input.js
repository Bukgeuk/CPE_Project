const { remote, ipcRenderer } = require('electron')

ipcRenderer.send('app', {type: "title", data: "학급 정부회장 선거 - 후보자 등록"})
ipcRenderer.send('app', {type: "resizeable", data: true})
ipcRenderer.send('app', {type: "hangul"})

let isFocusedInput = false
let next = 6
let candidateList = []
let mouseOverEventHandlers = []
let mouseOutEventHandlers = []
let clickEventHandlers = []
let focusEventHandlers = []
let blurEventHandlers = []

document.addEventListener('keypress', function(e){
    if (e.key === '+' && !isFocusedInput)
        addInput()
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

    {
        let div = document.createElement('div')
        div.id = "addInputDiv"
    
        let span = document.createElement('span')
        span.classList.add('medium-text', 'text')
        span.style.visibility = 'hidden'
        span.innerText = `${next}번`
    
        let button = document.createElement('button')
        button.classList.add('text', 'tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-blue-500', 'text-blue-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-blue-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', addInput)
        button.id = "addInput"
        button.innerText = "추가"
    
        div.appendChild(span)
        div.appendChild(button)
    
        target.appendChild(div)
    }

    /*target.innerHTML += `
    <div id="addInputDiv">
        <span class="medium-text text" style="visibility: hidden;">${next}번</span>
        <button class="text tracking-wide bold-text bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onclick="addInput()" id="addInput">추가</button>
    </div>`*/
}

function addInput() {
    let target = document.getElementById('scrollView')
    
    document.getElementById('addInputDiv').remove()

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
        button.classList.add('text', 'tracking-wide', 'bold-text', 'bg-transparent', 'hover:bg-blue-500', 'text-blue-500', 'font-semibold', 'hover:text-white', 'py-2', 'px-4', 'border', 'border-blue-500', 'hover:border-transparent', 'rounded')
        button.addEventListener('click', addInput)
        button.id = "addInput"
        button.innerText = "추가"
    
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
        let win = remote.getCurrentWindow()

        remote.dialog.showMessageBox(win, {type: 'error', title: '오류', message: '후보자가 입력되지 않았습니다', detail: '후보자 이름을 입력해주세요'})

        return
    }

    if (flag2) {
        let win = remote.getCurrentWindow()

        remote.dialog.showMessageBoxSync(win, {type: 'warning', title: '경고', message: '중간에 입력되지 않은 번호가 있습니다', detail: '자동으로 앞으로 당겨져서 기입됩니다'})
    }

    ipcRenderer.send('app', {type: 'getList', data: candidateList})

    setTimeout(() => {
        ipcRenderer.send('app', ({type: 'title', data: '학급 정부회장 선거 - 투표'}))
        location.href = './vote.html'
    }, 200)

    document.body.style.opacity = '0'
}

function clickCancel() {
    setTimeout(() => {
        ipcRenderer.send('app', ({type: 'title', data: '학급 정부회장 선거'}))
        ipcRenderer.send('app', {type: "size", data: {width: 480, height: 490}})
        ipcRenderer.send('app', {type: "fullscreen", data: false})
        ipcRenderer.send('app', {type: "unmaximize"})
        ipcRenderer.send('app', {type: "resizeable", data: false})
        location.href = './start.html'
    }, 200)

    document.body.style.opacity = '0'
}

function onMouseOver(number) {
    document.getElementById(`img${number}`).style.visibility = 'visible'
}

function onMouseOut(number) {
    document.getElementById(`img${number}`).style.visibility = 'hidden'
}

function deleteInput(number) {
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

    mouseOverEventHandlers.pop()
    mouseOutEventHandlers.pop()
    clickEventHandlers.pop()
}