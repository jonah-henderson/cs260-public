import * as express from 'express';
import { ApiRouter } from './router';
import setupSockets from './sockets';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { DB } from './dao';
import { Token } from './router/auth';

let app = express();
let server = new http.Server(app);
let io = socketIo(server);

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));

server.listen(process.env['PORT'] || 3000, () =>
{
  console.log(`Server listening on port 3000`);
});

app.use('/nocturne-spirit/api', ApiRouter);

io.use(async (socket, next) =>
{
  let cookie = socket.request.headers.cookie;

  let regexResults = /(?:token=(.+);)|(?:token=(.+)$)/.exec(cookie);

  let token = regexResults[1] || regexResults[2];

  if (!token)
  {
    return next(new Error('Invalid token'));
  }

  try
  {
    let decodedToken = (jwt.verify(token, process.env['NS_TOKEN_SECRET']) as Token);

    let player = await DB.Models.Player.findById(decodedToken.playerId);

    if (player === null)
    {
      return next(new Error('Invalid token'));
    }

    socket.request.player = player;

    next();
  } catch (err)
  {
    return next(new Error('Invalid token'));
  }
});

setupSockets(io);

io.on('connection', socket =>
{

  socket.emit('news', {hello: 'world'});
  socket.on('my other event', data =>
  {
    console.log(data);
  });

});