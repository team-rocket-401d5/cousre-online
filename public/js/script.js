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

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
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

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

let actions = {
  stopVideo(time) {
    console.log('stop meeeee nowwwww or I will do something  bad for me and you.!');
    player.pauseVideo();
    player.seekTo(time);
    // socket.emit('sync', player.getCurrentTime());
  },
  playVideo(time) {
    console.log('stop meeeee nowwwww or I will do something  bad for me and you.!');

    player.playVideo();
  },
};

socket.on('stopVideo', ({ time, action }) => {
  console.log('emited stoping in cleint');
  console.log(time);
  console.log(action);
  actions[action](time);
});
socket.on('playVideo', payload => {
  console.log('start video  in cleint');
  actions[payload](player.getCurrentTime());
});

socket.on('sendTime', host => {
  console.log('send time');
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
    console.log('stooooop');
    socket.emit('stop', player.getCurrentTime());
  }
  if (event.data === 1) {
    console.log('plaaaaaaaaaaaaay');

    socket.emit('play');
  }
}

$('form').submit((e)=>{
  e.preventDefault();
  $('#chat').append($('<p>').text($('#mess').val()));

  socket.emit('chat message',$('#mess').val());
  $('#mess').val('');
  return false;
});
socket.on('hi',(msg)=>{
  $('#chat').append($('<p>').text(`${msg.msg}`));
});