import * as mongoose from 'mongoose';
import { Player, PlayerModel } from './Player';
import { Spirit, SpiritModel } from './Spirit';
import { SparringMatch, SparringMatchModel } from './SparringMatch';

declare interface IModels
{
  Player: PlayerModel,
  Spirit: SpiritModel,
  SparringMatch: SparringMatchModel
}

export class DB
{
  private static instance: DB;

  private _db: mongoose.Connection;
  private _models: IModels;

  private constructor ()
  {
    mongoose.connect(`mongodb://localhost/nocturne-spirit`, {useNewUrlParser: true});
    this._db = mongoose.connection;

    this._db.on('open', this.connected);
    this._db.on('error', this.error);

    this._models = {
      Player: new Player().model,
      Spirit: new Spirit().model,
      SparringMatch: new SparringMatch().model
    };
  }

  public static get Models ()
  {
    if (!DB.instance)
    {
      DB.instance = new DB();
    }

    return DB.instance._models;
  }

  private connected ()
  {
    console.log(`Connected to mongodb`);
  }

  private error (err)
  {
    console.log(`DB error:`, err);
  }
}