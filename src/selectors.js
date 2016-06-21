import { createSelector } from 'reselect';

export const getNumberOfUsers = state => state.get('numberOfUsers');

const getRooms = state => state.get('rooms');

export const getNumberOfRooms = createSelector(
  getRooms,
  rooms => rooms.size
);

export const createGetRoom = roomName => createSelector(
  getRooms,
  rooms => rooms.get(roomName)
);

export const createGetPlaylist = roomName => createSelector(
  createGetRoom(roomName),
  room => room.get('playlist')
);

export const createGetVideoId = roomName => createSelector(
  createGetRoom(roomName),
  room => room.get('currentPlayingVideoId')
);
