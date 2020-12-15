'use strict';
const userModel = require('./models/user_schema');
// set-up
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const userRouter = require('./routes/userRouter.js');
const publicRouter = require('./routes/publicRouter.js');
const signupRouter = require('./routes/signupRouter.js');
const err404 = require('./middlewares/404.js');
const err500 = require('./middlewares/500.js');
const youtubeAPI = require('../lib/api/Youtube-api.js');
// const { UrlParser } = require('url-params-parser');
const http = require('http').createServer(app);
const queue = require('./models/collections/messagesQCollection.js');

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// middlewares
app.get('/bad', (req, res) => {
  throw new Error('a test error');
});

app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

app.use(express.static('./public'));
app.set('view engine', 'ejs');

// routers
app.post('/playlist', getPlaylistHandler); //
app.use('/', signupRouter);
app.use('/user', userRouter);
app.use('/public', publicRouter);
app.get('/messages/:roomId', getMessageQHandler);
app.post('/messages', saveMessageQHandler);
app.put('/messages', updateMessageQHandler);

app.get('/', (req, res) => {
  res.render('./index');
});

app.get('/party/invalid', (req, res) => {
  res.status(404).json({ message: 'invalid room id' });
});
app.get('/users', async (req, res) => {
  let result = await userModel.find({});
  res.send(result);
});

//errors
app.use(err404);
app.use(err500);

async function getPlaylistHandler(req, res) {
  const youtube = new youtubeAPI();
  const playlist = await youtube.fetchList(req.body.playlist);
  res.json(playlist);
}
//we are here -------------------------------------------------------------------------------------
async function saveMessageQHandler(req, res) {
  const messages = req.body;
  //{room_id , messages:[{msg,user},{}]}
  const result = await queue.save(messages);
  res.json(result);
}
async function updateMessageQHandler(req, res) {
  const messages = req.body;
  //{room_id , messages:[{msg,user},{}]}
  const result = await queue.enqueue(messages);
  res.json(result);
}
async function getMessageQHandler(req, res) {
  const roomId = req.params.roomId;
  const result = await queue.read(roomId);
  res.json(result);
}
const socketIOLocals = new Map();
// let isPause = false;
io.on('connection', (socket) => {
  console.log('connected');
  let roomId;
  socket.on('roomId init', (id) => {
    // console.log(id);
    roomId = id;

    console.log(roomId);
    ////
    // const { roomId } = UrlParser(
    //   socket.handshake.headers.referer,'http://localhost:3000/party/:roomId').namedParams;
    // console.log('room', UrlParser(
    //   socket.handshake.headers.referer,'http://localhost:3000/party/:roomId').namedParams);
    ////
    console.log('v', Object.keys(io.in(roomId).engine.clients));
    socket.join(roomId);

    socket.on('msg', (message) => {
      console.log('recieved in back', message);
      io.in(roomId).emit('get message', { message, roomId });
    });

    socket.on('set videos', (videos) => {
      if (!socketIOLocals.has(roomId)) {
        socketIOLocals.set(roomId, videos);
      }
    });

    socket.on('get videos', () => {
      const videos = socketIOLocals.get(roomId);
      socket.emit('client videos', videos);
    });
    socket.on('enter', () => {
      console.log('emiiting enter');
      const videos = socketIOLocals.get(roomId);
      socket.to(roomId).emit('reset active video', videos[0].video_id);
    });
    socket.on('update active video', (video) => {
      socket.to(roomId).emit('update active video', video);
    });
    socket.on('play', () => {
      socket.to(roomId).emit('play');
    });
    socket.on('pause', (time) => {
      socket.to(roomId).emit('pause', time);
    });
  });
  // socket.to(roomId).emit("update active video" , (video)=>{

  // })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = {
  server: http,
  start: () => {
    http.listen(PORT, () => {
      console.log(`up and running on port ${PORT}`);
    });
  },
};
