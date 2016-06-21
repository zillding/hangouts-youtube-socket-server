import socketIO from 'socket.io';

import * as actions from './actions';
import * as selectors from './selectors';
import { log, getNextVideoId } from './utils';

export default function setUpSocket(server, store) {
  const io = socketIO(server);

  log('Set up socket!');

  io.on('connection', socket => {

    log(`New connection detected with socket id: ${socket.id}`);

    // send initial stats
    const state = store.getState();
    socket.emit('init stats', {
      numberOfUsers: selectors.getNumberOfUsers(state),
      numberOfRooms: selectors.getNumberOfRooms(state),
    });

    let room = '';
    let getRoom = null;
    let getPlaylist = null;
    let getVideoId = null;

    socket.on('new user', ({ data } = {}) => {
      // validate data
      if (invalidNewUser(data)) return;

      const { roomName, playlist, videoId } = data;

      room = roomName.trim();
      socket.join(room);

      log(`User with socket id: ${socket.id} joined room: ${room}`);

      // send increment number of users
      store.dispatch(actions.incrementUsers(socket));

      getRoom = selectors.createGetRoom(room);
      getPlaylist = selectors.createGetPlaylist(room);
      getVideoId = selectors.createGetVideoId(room);

      if (!getRoom(store.getState())) {
        store.dispatch(actions.initRoom(room, socket));
      }

      // update room data
      // TODO: override the room data, may consider using merge
      // for better implementation in the future
      if (playlist.length > 0) {
        store.dispatch(actions.setPlaylist(room, playlist));
      }

      if (videoId) {
        store.dispatch(actions.setVideoId(room, videoId));
      }

      socket.emit('welcome', {
        data: {
          playlist: getPlaylist(store.getState()).toArray(),
          currentPlayingVideoId: getVideoId(store.getState()),
        },
      });
    });

    socket.on('action', ({ type, data } = {}) => {

      if (invalidAction(type, data)) return;

      io.in(room).emit('action', {
        type,
        data,
        senderId: socket.id,
      });

      // store on server
      switch (type) {
        case 'ADD_VIDEO': {
          // if the video to be added is the only video in the playlist
          // send the play command to play the video item
          if (getPlaylist(store.getState()).size === 0) {
            const videoId = data && data.id && data.id.videoId;
            io.in(room).emit('action', {
              type: 'PLAY',
              data: videoId,
            });
            store.dispatch(actions.setVideoId(room, videoId));
          }

          return store.dispatch(actions.addVideo(room, data));
        }

        case 'DELETE_VIDEO': {
          // if the video to be deleted is the current playing video
          // send the play command to play the next video item in the playlist
          const state = store.getState();
          const playlist = getPlaylist(state);
          const currentPlayingVideoId = getVideoId(state);
          if (currentPlayingVideoId === playlist.get(data).id.videoId) {
            const nextVideoId = getNextVideoId(playlist, currentPlayingVideoId);
            io.in(room).emit('action', {
              type: 'PLAY',
              data: nextVideoId,
            });
            store.dispatch(actions.setVideoId(room, nextVideoId));
          }

          return store.dispatch(actions.deleteVideo(room, data));
        }

        case 'PLAY':
          return store.dispatch(actions.setVideoId(room, data));
        default:
          return null;
      }
    });

    socket.on('disconnect', () => {

      log(`Socket with id: ${socket.id} disconnected.`);

      if (!room) return;

      // check and send decrement number of users
      store.dispatch(actions.decrementUsers(socket));

      // clean up the room data if all users left
      const socketRoom = io.sockets.adapter.rooms[room];
      if (!socketRoom) {
        store.dispatch(actions.deleteRoom(room, socket));
      }
    });
  });
}

function invalidNewUser(data) {
  log(`Event [new user] received with data: ${JSON.stringify(data)}`);
  if (!data) return true;
  if (invalidRoomName(data.roomName)) return true;
  if (invalidPlaylist(data.playlist)) return true;
  if (invalidVideoId(data.videoId)) return true;
  return false;
}

function invalidRoomName(roomName) {
  if (typeof roomName !== 'string' || !roomName.trim()) {
    log(`Invalide room name: ${roomName}`);
    return true;
  }

  return false;
}

function invalidPlaylist(playlist) {
  if (!playlist || !Array.isArray(playlist)) {
    log(`Invalid playlist: ${playlist}`);
    return true;
  }

  return false;
}

function invalidVideoId(videoId) {
  if (typeof videoId !== 'string') {
    log(`Invalid video id: ${videoId}`);
    return true;
  }

  return false;
}

function invalidAction(type, data) {
  log(`Event [action] received with type: ${type} and data: ${JSON.stringify(data)}`);

  switch (type) {
    case 'PLAY_NEXT':
    case 'PLAY_PREVIOUS':
    case 'PAUSE':
    case 'RESUME':
      return false;
    case 'ADD_VIDEO':
    case 'DELETE_VIDEO':
    case 'PLAY':
    case 'SYNC_TIME':
      break;
    default:
      return true;
  }

  if (type === 'ADD_VIDEO' &&
    data && data.id && typeof data.id.videoId === 'string') return false;

  if (type === 'DELETE_VIDEO' && typeof data === 'number') return false;

  if (type === 'PLAY' && typeof data === 'string') return false;

  if (type === 'SYNC_TIME' && typeof data === 'number') return false;

  log(`Invalid action data: ${data}`);
  return true;
}
