var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;
// const userNamespace = io.of('/current-user');

// io.on('connection', function(socket){
//   // socket.on('chat message', function(msg){
//   //   userNamespace.emit('chat message', msg);
//   // });
// });
//
// socketApi.sendNotification = function() {
//   io.sockets.emit('hello', {msg: 'Hello World!'});
// }
const clients = [];

io.on('connection', function(socket){
  console.log('a user connected', clients.push(socket.id));
});

module.exports = socketApi;
