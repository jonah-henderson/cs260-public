import axios from 'axios';
import { ISpirit } from '../../../common/data/spirit';
import * as socketIo from "socket.io-client";
import { Store } from '@/store/index';

export class Spirit
{
  currentSpirit: ISpirit | null = null;

  _spiritSocket?: SocketIOClient.Socket;

  get spiritSocket()
  {
    if (this._spiritSocket)
      return this._spiritSocket;

    else
    {
      this._spiritSocket = socketIo.connect("192.168.1.191:3000/spirit");
      this._spiritSocket.on('update', (data: any) => this.currentSpirit = data);

      return this._spiritSocket;
    }
  }

  setupSocket()
  {
    this.spiritSocket;
  }

  async createSpirit(name: string)
  {
    let res = await axios.post('spirits', {name});
    this.currentSpirit = res.data;
  }

  async getActiveSpirit(force = false)
  {
    if (this.currentSpirit === null || force)
    {
      let res = await axios.get('spirits/active');
      this.currentSpirit = res.data;
    }
  }

  train(trainingId: string)
  {
    this.spiritSocket.emit('train', {trainingId});
  }

  rest()
  {
    this.spiritSocket.emit('rest');
  }

  stopRest()
  {
    this.spiritSocket.emit('stopRest');
  }

  reset()
  {
    this._spiritSocket = undefined;
    this.currentSpirit = null;
  }
}