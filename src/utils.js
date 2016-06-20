export function log(...msg) {
  console.log(Date(), '=>', ...msg); // eslint-disable-line no-console
}

export function logError(...msg) {
  console.error(Date(), '=>', ...msg); // eslint-disable-line no-console
}

function getVideoIndex(playlist, videoId) {
  return playlist.findIndex(video => video.id.videoId === videoId);
}

export function getNextVideoId(playlist, currentVideoId) {
  if (!currentVideoId) {
    const first = playlist.first();
    if (first) return first.id.videoId;
    return '';
  }

  const index = getVideoIndex(playlist, currentVideoId) + 1;
  const video = playlist.get(index);
  if (video) return video.id.videoId;
  return '';
}
