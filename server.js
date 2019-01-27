const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8000, () => console.log('listening on *:8000'));

io.on('connection', (socket) => {
  socket.on('getRoomInfo', (roomId) => {
    socket.emit('roomInfo', socket.adapter.rooms[roomId]);
  });

  socket.on('join', (roomId) => {
    socket.join(roomId);

    socket.on('newPlayer', (newPlayerInfo) => {
      socket.to(roomId).emit('newPlayer', newPlayerInfo);
    });
    socket.on('getPlayers', () => {
      socket.to(roomId).emit('getPlayers');
    });
    socket.on('getPlayersRet', (playersRet) => {
      socket.to(roomId).emit('getPlayersRet', playersRet);
    });
    socket.on('hostDisconnect', () => {
      socket.to(roomId).emit('hostDisconnect');
    });
    socket.on('clientDisconnect', (client) => {
      socket.to(roomId).emit('clientDisconnect', client);
    });
    socket.on('leaveRoom', () => {
      socket.leave(roomId);
    });
  });
});
