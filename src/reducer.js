import { fromJS, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { log } from './utils';

function numberOfUsers(state = 0, { type, socket }) {
  switch (type) {
    case 'USERS_INCREMENT':
      socket.broadcast.emit('update user', 1);
      return state + 1;
    case 'USERS_DECREMENT':
      socket.broadcast.emit('update user', -1);
      return state - 1;
    default:
      return state;
  }
}

function rooms(state = fromJS({}), action) {
  switch (action.type) {
    case 'ROOM_INIT':
      log(`New room created: ${action.roomName}`);
      action.socket.broadcast.emit('update room', 1);
      return state.set(action.roomName, fromJS({
        playlist: List(),
        currentPlayingVideoId: '',
      }));
    case 'ROOM_DELETE':
      log(`Room deleted: ${action.roomName}`);
      action.socket.broadcast.emit('update room', -1);
      return state.delete(action.roomName);
    case 'PLAYLIST_SET':
      return state.setIn([action.roomName, 'playlist'], List(action.data));
    case 'VIDEO_ID_SET':
      return state.setIn([action.roomName, 'currentPlayingVideoId'], action.videoId);
    case 'VIDEO_ADD':
      return state.setIn([action.roomName, 'playlist'],
        state.getIn([action.roomName, 'playlist']).push(action.data));
    case 'VIDEO_DELETE':
      return state.setIn([action.roomName, 'playlist'],
        state.getIn([action.roomName, 'playlist']).delete(action.index));
    default:
      return state;
  }
}

export default combineReducers({
  numberOfUsers,
  rooms,
});
