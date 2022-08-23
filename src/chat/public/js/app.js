const socket = io();

const welcome = document.getElementById('welcome')
const form = welcome.querySelector('form')
const room = document.getElementById('room')

room.hidden = true;

let roomName, nickName;

function addMessage(message) {
    const ul = room.querySelector('ul')
    const li = document.createElement('li')
    li.innerText = message
    ul.appendChild(li)
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input')
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`)
    });
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3')
    h3.innerText = `Room ${roomName}`
    span = room.querySelector("span")
    span.innerText = `My nickname: ${nickName}`
    const msgForm = room.querySelector('#msg')
    msgForm.addEventListener('submit', handleMessageSubmit)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const inputRoomName = form.querySelector('#roomname')
    const inputNickName = form.querySelector('#nickname')

    roomName = inputRoomName.value;
    nickName = inputNickName.value;

    socket.emit('enter_room', roomName, nickName, showRoom)
    inputRoomName.value = ''
    inputNickName.value = ''
}

form.addEventListener('submit', handleRoomSubmit)

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector('h3')
    h3.innerText = `Room ${roomName} (${newCount}명)`
    addMessage(`${user} 침입!`)
})

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector('h3')
    h3.innerText = `Room ${roomName} (${newCount}명)`
    addMessage(`${left}가 나갑니다.`)
})

socket.on("new_message", addMessage)
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul")
    if (rooms.length === 0) {
        roomList.innerHTML = '';
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = '방개설: ' + room
        roomList.append(li)
    })
})