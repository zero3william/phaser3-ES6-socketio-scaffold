const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

let playerList = new Map();
let roomList = Array.apply(null, Array(2)).map(() => {
  return {
    green: null,
    blue: null,
    isStart: false,
    pieceList: null
  };
});

io.on('connection', socket => {
  let index = roomList.findIndex((item, index) => {
    if (item.isStart === false) {
      if (item.green === null) {
        item.green = socket.id;
        socket.join(`room${index}`);
        playerList.set(socket.id, { room: index, color: 'green' });
        return true;
      }
      if (item.blue === null) {
        item.blue = socket.id;
        socket.join(`room${index}`);
        playerList.set(socket.id, { room: index, color: 'blue' });

        initGameBoard(roomList[index]);
        io.to(`room${index}`).emit('gameStart', roomList[index]);
        return true;
      }
    } else {
      return false;
    }
  });

  console.log(`user ${socket.id} connected`);
  console.log('rooms:', roomList);
  console.log('players:', playerList);

  //table all full
  if (index === -1) {
    console.log('full table');
    return 0;
  }

  //user disconneect
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    io.in(`room${playerList.get(socket.id).room}`).clients((error, clients) => {
      if (error) throw error;
      clients.forEach(clientid => {
        io.sockets.sockets[clientid].emit('stopGame');
      });
    });
    player_exit(socket.id);
    // io.sockets.sockets[clientid].disconnect();
  });
});

app.set('port', 8080);
server.listen(app.get('port'), () => {
  console.log(`Listening on ${server.address().port}`);
});

function player_exit(id) {
  const player = playerList.get(id);
  roomList[player.room][player.color] = null;
  roomList[player.room].isStart = false;
  playerList.delete(id);
}

function initGameBoard(room) {
  room.isStart = true;
  room.pieceList = [
    { x: 0, y: 0, owner: 'blue', type: 'giraffe' },
    { x: 1, y: 0, owner: 'blue', type: 'lion' },
    { x: 2, y: 0, owner: 'blue', type: 'elephant' },
    { x: 1, y: 1, owner: 'blue', type: 'chick' },
    { x: 1, y: 2, owner: 'green', type: 'chick' },
    { x: 0, y: 3, owner: 'green', type: 'elephant' },
    { x: 1, y: 3, owner: 'green', type: 'lion' },
    { x: 2, y: 3, owner: 'green', type: 'giraffe' }
  ];
}
