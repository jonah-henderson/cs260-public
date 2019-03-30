import * as mongoose from 'mongoose';
import { IPlayer } from '../../common/data/player';
import { ISparringMatch, Move } from '../../common/data/sparringMatch';

export interface SparringMatchDocument extends ISparringMatch, mongoose.Document {}

export interface SparringMatchModel extends mongoose.Model<SparringMatchDocument> {}

export class SparringMatch
{

  private readonly _model: mongoose.Model<SparringMatchDocument>;

  constructor ()
  {

    const schema = new mongoose.Schema({
      contestant1Id: {type: mongoose.SchemaTypes.ObjectId, ref: "Spirit"},
      contestant2Id: {type: mongoose.SchemaTypes.ObjectId, ref: "Spirit"},
      contestant1PendingMove: String,
      contestant2PendingMove: String,
      contestant1NextMove: String,
      contestant2NextMove: String,
      contestant1Stats:
      {
        atk: Number,
        def: Number,
        hp:  Number
      },
      contestant2Stats:
      {
        atk: Number,
        def: Number,
        hp:  Number
      },
      status: String,
      victor: {type: mongoose.SchemaTypes.ObjectId, ref: "Spirit"}
    });

    this._model = mongoose.model<SparringMatchDocument>('sparring-match', schema);
  }

  public get model (): mongoose.Model<SparringMatchDocument>
  {
    return this._model;
  }

}