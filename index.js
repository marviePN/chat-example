
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var ip = require("ip");
var port = process.env.PORT || 3000;

var clients = [];
var incr = 1;

function getUsersList(){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n;
    }
  return usersList;
}

function setUserTyping(index){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n; 
    }
  usersList[index] = "💬 " + clients[index].n;
  return usersList;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  clients.push(socket);

  socket.on('start', function(){
    socket.emit('nick', "guest"+incr);
    clients[clients.indexOf(socket)].n = "guest"+incr;
    incr++;
    io.emit('users list', getUsersList());
  });

  socket.on('send chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('set nick', function(nick){
    io.emit('info', "New user: " + nick); //console.log(nick);
    clients[clients.indexOf(socket)].n = nick; //console.log(clients[clients.indexOf(socket)].n);
    io.emit('users list', getUsersList()); //console.log(getUsersList());
  });

  socket.on('typing', function(){
    io.emit('typing signal', setUserTyping(clients.indexOf(socket))); //console.log(setUserTyping(clients.indexOf(socket)));
  });

  socket.on('not typing', function(){
    io.emit('typing signal', getUsersList()); //console.log(getUsersList());
  });

  socket.on('disconnect', function() {
    if( clients[clients.indexOf(socket)].n == null ){
      //console.log('Guest disconnect!');
    }
    else{
      //console.log(clients[clients.indexOf(socket)].n +' disconnect!');
      io.emit('info', "User " + clients[clients.indexOf(socket)].n + " disconnected.");
    }
    clients.splice(clients.indexOf(socket),1);//clientIndex, 1);
    io.emit('users list', getUsersList());
   });
});

// http.listen(3000, function(){
//   console.log("listening on localhost:3000 and "+ip.address()+":3000");
// });
  http.listen(port, function(){
    console.log('listening on *:' + port);
});

// var app = require('express')();
// var http = require('http').Server(app);
// var port = 59995;

// http.listen(port, function(){
// console.log('listening on %s', port);
// });

// var io = require('socket.io')(http);

// var clients = [];

// io.on('connection', function(socket){

// console.log("Socket %s connected!", socket.id);

// socket.on('new client', function(d){
// addClient(socket.id, d.user_id);
// });

// socket.on('send message', function(d){

// var emitDetails = {
// 'fromUser_id': d.fromUser_id,
// 'message': d.message    
// };

// if(d.fromUser_id === d.toUser_id) {

// socket.emit('new message', emitDetails);
// console.log("Message sent to: %s", socket.id);

// } else {

// var socket_ids = getSocketIds(d.toUser_id);

// for(var i=0; i<socket_ids.length; i++) {

// socket.broadcast.to(socket_ids[i]).emit('new message', emitDetails);
// console.log("Message sent to: %s", socket_ids[i]);
// }
// }
// });

// socket.on('disconnect', function(){
// removeClient(socket.id);
// });
// });

// function addClient(socket_id, user_id) {

// var _client = {
// 'socket_id': socket_id,
// 'user_id': user_id
// },
// _index = clients.indexOf(_client);

// if(_index === -1) {
// clients.push(_client);
// }

// console.log("New client: %s", socket_id);

// return true;
// }

// function removeClient(socket_id) {

// var _index = null;

// for(var i=0; i<clients.length; i++) {
// if(clients[i].socket_id === socket_id) {
// _index = i;
// break;
// }
// }

// if(_index !== null) {
// clients.splice(_index, 1);
// }

// console.log("Remove client: %s", socket_id);

// return true;
// }

// function getSocketIds(user_id) {

// var socket_ids = [];

// for(var i=0; i<clients.length; i++) {
// if(clients[i].user_id === user_id) {
// socket_ids.push(clients[i].socket_id);
// }
// }

// return socket_ids;
// }