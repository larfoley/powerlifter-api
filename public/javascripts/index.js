const socket = io();
socket.on('connect', () => {
  console.log('connected');
})


socket.on('private message', () => {
  alert('user created')
})

// socket.of('/current-user').on('chat message', () => {
//   alert('')
// })
