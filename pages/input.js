const { ipcRenderer } = require('electron')

ipcRenderer.send('app', {type: "title", data: "학급 정부회장 선거 - 후보자 등록"})
ipcRenderer.send('app', {type: "resizeable", data: true})
ipcRenderer.send('app', {type: "hangul"})

let next = 6

document.addEventListener('keypress', function(e){
    if (e.key === '+')
        addInput()
})

window.onload = function() {
    document.body.style.opacity = '1'

    let target = document.getElementById('scrollView')
    for (let i = 0; i < 5; i++) {
        target.innerHTML += `
        <div>
            <span class="medium-text text">${i + 1}번</span>
            <input class="focus:outline-none focus:shadow-outline rounded-lg px-3 appearance-none leading-normal input border text light-text" type="text" placeholder="이름 입력" id="inputName${i}">
        </div>`
    }

    target.innerHTML += `
    <div id="addInputDiv">
        <span class="medium-text text" style="visibility: hidden;">${next}번</span>
        <button class="text tracking-wide bold-text bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onclick="addInput()" id="addBtn">추가</button>
    </div>`
}

function addInput() {
    let target = document.getElementById('scrollView')
    
    document.getElementById('addInputDiv').remove()

    target.innerHTML += `
    <div>
        <span class="medium-text text">${next}번</span>
        <input class="focus:outline-none focus:shadow-outline rounded-lg px-3 appearance-none leading-normal input border text light-text" type="text" placeholder="이름 입력" id="inputName${next - 1}">
    </div>`

    target.innerHTML += `
    <div id="addInputDiv">
        <span class="medium-text text" style="visibility: hidden;">${next}번</span>
        <button class="text tracking-wide bold-text bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onclick="addInput()" id="addBtn">추가</button>
    </div>`

    next++

    let elem = document.getElementsByTagName('section')[0]
    elem.scrollTop = elem.scrollHeight
}