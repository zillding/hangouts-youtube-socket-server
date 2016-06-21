export const incrementUsers = () => ({
  type: 'USERS_INCREMENT',
});

export const decrementUsers = () => ({
  type: 'USERS_DECREMENT',
});

export const initRoom = roomName => ({
  type: 'ROOM_INIT',
  roomName,
});

export const deleteRoom = roomName => ({
  type: 'ROOM_DELETE',
  roomName,
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
