export const incrementUsers = socket => ({
  type: 'USERS_INCREMENT',
  socket,
});

export const decrementUsers = socket => ({
  type: 'USERS_DECREMENT',
  socket,
});

export const initRoom = (roomName, socket) => ({
  type: 'ROOM_INIT',
  roomName,
  socket,
});

export const deleteRoom = (roomName, socket) => ({
  type: 'ROOM_DELETE',
  roomName,
  socket,
});

export const setPlaylist = (roomName, data) => ({
  type: 'PLAYLIST_SET',
  roomName,
  data,
});

export const setVideoId = (roomName, videoId) => ({
  type: 'VIDEO_ID_SET',
  roomName,
  videoId,
});

export const addVideo = (roomName, data) => ({
  type: 'VIDEO_ADD',
  roomName,
  data,
});

export const deleteVideo = (roomName, index) => ({
  type: 'VIDEO_DELETE',
  roomName,
  index,
});
