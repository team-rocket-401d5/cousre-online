/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

let socket = io();
let tag = document.createElement('script');
const sync = document.getElementById('sync');

sync.addEventListener('click', e => {
  socket.emit('sync', player.getCurrentTime());
});

tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// will be in the react as a component
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    playerVars: {
      rel: 0,
      autoplay: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

let actions = {
  stopVideo(time) {
    player.seekTo(time);
    player.pauseVideo();
    // socket.emit('sync', player.getCurrentTime());
  },
  playVideo(time) {
    player.playVideo();
  },
};

socket.on('stopVideo', ({ time, action }) => {
  actions[action](time);
});
socket.on('playVideo', payload => {
  actions[payload](player.getCurrentTime());
});

socket.on('sendTime', host => {
  if (host === socket.io.engine.id)
    socket.emit('getTime', { time: player.getCurrentTime(), id: socket.io.engine.id });
});

socket.on('syncVideo', time => {
  player.pauseVideo();
  player.seekTo(time);
});

function onStateChange(event) {
  console.log(event.data);
  if (event.data === 2) {
    socket.emit('stop', player.getCurrentTime());
  }
  if (event.data === 1) {
    socket.emit('play');
  }
}


// chat appending

$('form').submit(e => {
  e.preventDefault();
  $('#chat').append($('<p>').text($('#mess').val()));

  socket.emit('chat message', $('#mess').val());
  $('#mess').val('');
  return false;
});
socket.on('hi', msg => {
  $('#chat').append($('<p>').text(`${msg.msg}`));
});
