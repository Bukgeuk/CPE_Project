function sort(arr) {
    arr.sort((a, b) => { 
        if (a.value < b.value)
            return 1
        else if (a.value > b.value)
            return -1
        else
            return 0
    })
}

function count(list, name) {
    let count = 0
    let array = []

    for (let i = 0; i < list.length; i++)
        array.push(list[i].value)

    array.sort()

    
}

function vote(name){
    candidateList.forEach((item) => {
        if (item.name === name) item.value++
    })
}