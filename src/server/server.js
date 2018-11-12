const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

let playerList = new Map();

let roomList = Array.apply(null, Array(4)).map(() => {
  return {
    green: null,
    blue: null,
    isStart: false
  };
});

io.on('connection', socket => {
  let index = roomList.findIndex((item, index) => {
    if (item.isStart === false) {
      if (item.green === null) {
        item.green = socket;
        socket.join(`room${index}`);
        return true;
      }
      if (item.blue === null) {
        item.blue = socket;
        item.isStart = true;
        socket.join(`room${index}`);
        io.to(`room${index}`).emit('gameStart');
        return true;
      }
    } else {
      return false;
    }
  });

  //table all full
  if (index === -1) {
    return 0;
  }

  playerList.set(socket.id, index);

  console.log(`user ${socket.id} connected`);
  console.log('rooms:', roomList);
  console.log('players:', playerList);

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    roomList[playerList.get(socket.id)] = {
      green: null,
      blue: null,
      isStart: false
    };
    playerList.delete(socket.id);
  });
});

app.set('port', 8080);
server.listen(app.get('port'), () => {
  console.log(`Listening on ${server.address().port}`);
});
