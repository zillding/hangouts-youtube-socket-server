import { List } from 'immutable';
import  socketIO from 'socket.io';

import { log } from './utils';

// Global state data
const rooms = {};

function initRoom(name) {
  rooms[name] = {
    playlist: List(),
    currentPlayingVideoId: '',
  };
}

function deleteRoom(name) {
  if (rooms[name]) {
    delete rooms[name];
  }
}

// mutate the global state
function updateData(room, field, data) {
  if (rooms[room]) {
    rooms[room][field] = data;
  }
}

function setUpSocket(server) {
  const io = socketIO(server);

  log('Socket done set up.');

  io.on('connection', socket => {

    log(`New connection detected with socket id: ${socket.id}`);

    // TODO: send initial stats

    let room = '';

    socket.on('new user', ({ data }) => {
      log(`Event [new user] received with data: ${data}`);

      room = data.trim() || room;
      socket.join(room);

      log(`User with socket id: ${socket.id} joined room: ${room}`);

      // TODO: send increment number of users

      if (!rooms[room]) {
        initRoom(room);

        log(`New room created: ${room}`);

        // TODO: send increment number of rooms
      }

      const { playlist, currentPlayingVideoId } = rooms[room];

      socket.emit('welcome', {
        data: {
          playlist: playlist.toArray(),
        },
      });

      if (currentPlayingVideoId) {
        socket.emit('action', {
          type: 'PLAY',
          data: currentPlayingVideoId,
        });
      }
    });

    socket.on('action', ({ type, data }) => {

      log(`Event [action] received with type: ${type}`);

      io.in(room).emit('action', {
        type,
        data,
        senderId: socket.id,
      });

      // store on server
      switch (type) {
        case 'ADD_VIDEO':
          return updateData(room, 'playlist', rooms[room].playlist.push(data));
        case 'DELETE_VIDEO':
          return updateData(room, 'playlist', rooms[room].playlist.delete(data));
        case 'PLAY':
          return updateData(room, 'currentPlayingVideoId', data);
        default:
          return null;
      }
    });

    socket.on('disconnect', () => {

      log(`Socket with id: ${socket.id} disconnected.`);

      // TODO: check and send decrement number of users

      // clean up the room data if all users left
      const socketRoom = io.sockets.adapter.rooms[room];
      if (socketRoom && socketRoom.length === 0) {

        log(`Room: ${room} is empty.`);

        deleteRoom(room);

        // TODO: send decrement number of rooms
      }
    });
  });
}

export default setUpSocket;
