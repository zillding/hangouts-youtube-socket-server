/* eslint-disable */

const socket = io();

socket.on('init stats', function initStats(msg) {
  // set initial stats
  console.log(msg);
  $('#numberOfUsers').html(msg.numberOfUsers);
  $('#numberOfRooms').html(msg.numberOfRooms);
});

socket.on('update user', function updateUser(msg) {
  console.log(msg);
  const newNum = getNewNumber($('#numberOfUsers').html(), msg);
  $('#numberOfUsers').html(newNum);
});

socket.on('update room', function updateRoom(msg) {
  console.log(msg);
  const newNum = getNewNumber($('#numberOfRooms').html(), msg);
  $('#numberOfRooms').html(newNum);
});

function getNewNumber(numString, update) {
    return (Number(numString) || 0) + update;
}
