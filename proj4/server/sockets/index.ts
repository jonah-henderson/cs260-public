import * as SocketIO from 'socket.io';

import spirit from './spirit'
import sparring from './sparring';

export default function init(io: SocketIO.Server)
{
  spirit(io);
  sparring(io);
}