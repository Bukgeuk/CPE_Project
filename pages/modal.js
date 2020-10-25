const { shell } = require('electron')

window.onload = () => {
    document.body.style.opacity = '1'

    let text = document.getElementById('text')

    const query = getQueryString()

    if (query.status === "fail") {
        text.innerText = '문제가 발생했습니다\n네트워크 상태를 확인해주세요'
        text.classList.add('text-red-500')
        document.getElementById('currentVersion').innerText = `현재 버전 : ${getCurrentVersion()}`
        document.querySelector('article > button').style.display = 'none'
    } else if (query.status === "update") {
        text.innerText = '업데이트가 필요합니다'
        text.classList.add('text-blue-500')
        document.getElementById('currentVersion').innerText = `현재 버전 : ${getCurrentVersion()}`
        document.getElementById('lastestVersion').innerText = `최신 버전 : ${query.lastest}`
    } else if (query.status === "updated") {
        text.innerText = '최신 버전입니다'
        text.classList.add('text-green-500')
        document.getElementById('currentVersion').innerText = `현재 버전 : ${getCurrentVersion()}`
        document.getElementById('lastestVersion').innerText = `최신 버전 : ${query.lastest}`
    }
}

function goToDownload() {
    shell.openExternal("https://github.com/Bukgeuk/CPE_Project/releases/latest")
}