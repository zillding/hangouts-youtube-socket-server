import { List } from 'immutable';
import  socketIO from 'socket.io';

import { log } from './utils';

// Global state data
const rooms = {};
let numberOfUsers = 0;

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

    // send initial stats
    socket.emit('init stats', {
      numberOfUsers,
      numberOfRooms: Object.keys(rooms).length,
    });

    let room = '';

    socket.on('new user', ({ data }) => {
      log(`Event [new user] received with data: ${JSON.stringify(data)}`);

      const { roomName, playlist, videoId } = data;

      room = roomName.trim() || room;
      socket.join(room);

      log(`User with socket id: ${socket.id} joined room: ${room}`);

      // send increment number of users
      numberOfUsers++;
      socket.broadcast.emit('update user', 1);

      if (!rooms[room]) {
        initRoom(room);

        log(`New room created: ${room}`);

        // send increment number of rooms
        socket.broadcast.emit('update room', 1);
      }

      // update room data
      // TODO: override the room data, may consider using merge
      // for better implementation in the future
      if (playlist.length > 0) {
        updateData(room, 'playlist', List(playlist));
      }

      if (videoId) {
        updateData(room, 'currentPlayingVideoId', videoId);
      }

      socket.emit('welcome', {
        data: {
          playlist: rooms[room].playlist.toArray(),
        },
      });

      if (rooms[room].currentPlayingVideoId) {
        socket.emit('action', {
          type: 'PLAY',
          data: rooms[room].currentPlayingVideoId,
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

      if (!room) return;

      // check and send decrement number of users
      numberOfUsers--;
      socket.broadcast.emit('update user', -1);

      // clean up the room data if all users left
      const socketRoom = io.sockets.adapter.rooms[room];
      if (!socketRoom) {

        log(`Room: ${room} is empty.`);

        deleteRoom(room);

        // send decrement number of rooms
        socket.broadcast.emit('update room', -1);
      }
    });
  });
}

export default setUpSocket;
