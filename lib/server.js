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
app.get('/messages/:roomId',getMessageQHandler);
app.post('/messages',saveMessageQHandler);
app.put('/messages',updateMessageQHandler);

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
async function saveMessageQHandler(req,res){
  const messages = req.body;
  //{room_id , messages:[{msg,user},{}]}
  const result = await queue.save(messages);
  res.json(result);

}
async function updateMessageQHandler(req,res){
  const messages = req.body;
  //{room_id , messages:[{msg,user},{}]}
  const result = await queue.save(messages);
  res.json(result);

}
async function getMessageQHandler(req,res){
  const roomId = req.params.roomId;
  const result = await queue.read(roomId);
  res.json(result);

}
// let isPause = false;
io.on('connection', socket => {
  console.log('connected');
  ////
  // const { roomId } = UrlParser(socket.handshake.headers.referer, '/party/:roomId').namedParams;
  ////
  // socket.on('stop', time => {
  //   console.log('stop broadcast from server');
  //   console.log(isPause);
  //   if (!isPause) socket.in(roomId).emit('stopVideo', { action: 'stopVideo', time });
  // });
  // socket.on('play', () => {
  //   isPause = false;
  //   console.log('start broadcast from server');
  //   socket.in(roomId).emit('playVideo', 'playVideo');
  // });
  // let time;
  // socket.on('getTime', payload => {
  //   if (payload.id === Object.keys(io.in(roomId).engine.clients)[0]) time = payload.time;
  // });

  // socket.on('sync', time => {
  //   socket.in(roomId).emit('syncVideo', time);
  // });

  // socket.on('join', room => {
  //   let rooms = room;
  //   socket.join(`${rooms}`, payload => {
  //     io.to(`${room}`).emit(payload.data);
  //   });
  // });
  let roomId = '';
  socket.on('joinRoom', (room) => {
    roomId = room;
    socket.join(room);
    console.log('a user connected to a room');

    socket.on('chat message', payload => {
      console.log(payload.emitted);
      socket.in(roomId).emit('Msg', { emitted: payload.emitted, roomId: payload.roomId }); // boradcast to other sockets but not the current
    });
  });
    
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
