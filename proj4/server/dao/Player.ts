import * as mongoose from 'mongoose';
import { IPlayer } from '../../common/data/player';

export interface PlayerDocument extends IPlayer, mongoose.Document {}

export interface PlayerModel extends mongoose.Model<PlayerDocument> {}

export class Player
{

  private readonly _model: mongoose.Model<PlayerDocument>;

  constructor ()
  {

    const schema = new mongoose.Schema({
      username: {type: String, required: true, unique: true, lowercase: true, trim: true},
      displayName: {type: String, trim: true, unique: true},
      pwHash: {type: String, required: true},
      created: {type: Date, default: Date.now},
      tokens: [String]
    });

    schema.set("toJSON", {
      transform: (doc, ret, opts) => {
        delete ret.pwHash;
        delete ret.tokens;
        return ret;
      }
    });

    this._model = mongoose.model<PlayerDocument>('Player', schema);
  }

  public get model (): mongoose.Model<PlayerDocument>
  {
    return this._model;
  }

}