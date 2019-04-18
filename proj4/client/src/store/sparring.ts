import axios from 'axios';
import * as socketIo from "socket.io-client";
import { BattleStats, ISparringMatch } from '../../../common/data/sparringMatch';
import { ISpirit } from '../../../common/data/spirit';
import { IPlayer } from '../../../common/data/player';
import { Store } from '@/store/index';

export class Sparring
{
  activeMatch: ISparringMatch | null = null;
  opponentSpirit: ISpirit | null = null;
  opponentPlayer: IPlayer | null = null;
  opponentBattleStats: BattleStats | null = null;

  mySpirit: ISpirit | null = null;
  myPlayer: IPlayer | null = null;
  myBattleStats: BattleStats | null = null;
  myMove: string | null = null;

  matchResult: "win" | "loss" | "draw" | null = null;
  showResult = false;

  _sparringSocket?: SocketIOClient.Socket;

  get sparringSocket()
  {
    if (this._sparringSocket)
      return this._sparringSocket;

    else
    {
      this._sparringSocket = socketIo.connect("192.168.1.191:3000/sparring");

      this._sparringSocket.on('matchFound', (data: any) =>
      {
        this.sparringSocket.emit('connectToMatch', {matchId: data._id});
        this.loadMatch(data)
      });
      this._sparringSocket.on('update', (data: any) => this.updateMatch(data) );
      this._sparringSocket.on('roundReport', (data: any) => console.log(data));
      this._sparringSocket.on('matchOver', (data: any) => this.finishMatch(data));

      return this._sparringSocket;
    }
  }

  setupSocket()
  {
    this.sparringSocket;
  }

  searchForPartner()
  {
    this.sparringSocket.emit("searchForPartner");
  }

  cancelSearch()
  {
    this.sparringSocket.emit("stopSearch");
  }

  sendAction(actionId: string)
  {
    this.sparringSocket.emit("action", {
        actionId: actionId,
      spiritId: this.mySpirit!._id,
      matchId: this.activeMatch!._id
    });
  }

  async getActiveMatch(spiritId?: string)
  {
    try
    {
      let res = await axios.get('sparring/active', {params: {forSpirit: spiritId}});
      let matchId = res.data._id;

      this.sparringSocket.emit('connectToMatch', {matchId});

      this.loadMatch(res.data);
    }
    catch (err)
    {
      if (err.statusCode && err.data)
      {
        window.alert(err.data.err);
      }
      else
      {
        console.log(err);
      }
    }
  }

  finishMatch(data: any)
  {
    let winner = data.winner;

    if (winner === null)
      this.matchResult = "draw";

    else if (winner == this.mySpirit!._id)
      this.matchResult = "win";

    else
      this.matchResult = "loss";

    this.showResult = true;
    this.activeMatch = null;
  }

  closeResults()
  {
    this.showResult = false;
  }

  reset()
  {
    this._sparringSocket = undefined;
  }

  private async loadMatch(data: ISparringMatch)
  {
    this.mySpirit = Store.spirit.currentSpirit!;
    this.myPlayer = (await axios.get(`players/${this.mySpirit.player}`)).data;

    if (Store.spirit.currentSpirit!._id == data.contestant1Id)
    {
      this.myBattleStats = data.contestant1Stats;
      this.myMove = data.contestant1PendingMove;
      this.opponentBattleStats = data.contestant2Stats;
    }
    else
    {
      this.myBattleStats = data.contestant2Stats;
      this.myMove = data.contestant2PendingMove;
      this.opponentBattleStats = data.contestant1Stats;
    }

    let otherSpiritId =
      data.contestant1Id == Store.spirit.currentSpirit!._id
        ? data.contestant2Id
        : data.contestant1Id;

    let res = await axios.get(`spirits/${otherSpiritId}`);
    this.opponentSpirit = res.data;

    res = await axios.get(`players/${this.opponentSpirit!.player}`);
    this.opponentPlayer = res.data;

    this.activeMatch = data;
  }

  private updateMatch(data: ISparringMatch)
  {
    if (Store.spirit.currentSpirit!._id == data.contestant1Id)
    {
      this.myBattleStats = data.contestant1Stats;
      this.myMove = data.contestant1PendingMove;
      this.opponentBattleStats = data.contestant2Stats;
    }
    else
    {
      this.myBattleStats = data.contestant2Stats;
      this.myMove = data.contestant2PendingMove;
      this.opponentBattleStats = data.contestant1Stats;
    }
  }
}