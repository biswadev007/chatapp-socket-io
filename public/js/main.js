const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

//Join Chat room
socket.emit('joinRoom', ({username, room}))

socket.on('message', message =>{
  onChatMessages(message);

  //Scroll Down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Get Room and Users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

//Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  //Get chat text
  const msg = e.target.elements.msg.value;
  
  //Show messge
  socket.emit('chatMessage', msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

const onChatMessages = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.userName}<span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}


// Add room in dom
const outputRoomName = (room) => {
  roomName.innerHTML = room;
}

// Add user in dom
const outputUsers = (users) =>{
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}