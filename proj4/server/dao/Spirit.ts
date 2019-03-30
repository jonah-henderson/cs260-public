import * as mongoose from 'mongoose';
import { ISpirit } from '../../common/data/spirit';

interface ISpiritServerOnly
{
  player: mongoose.Schema.Types.ObjectId
}

export interface SpiritDocument extends ISpirit, ISpiritServerOnly, mongoose.Document {}

export interface SpiritModel extends mongoose.Model<SpiritDocument> {}

export class Spirit
{

  private readonly _model: mongoose.Model<SpiritDocument>;

  constructor ()
  {

    const schema = new mongoose.Schema({
      name: {type: String, required: true},
      created: {type: Date, default: Date.now},
      stats: {
        power: {type: Number, default: 0},
        life: {type: Number, default: 0},
        endurance: {type: Number, default: 0},
        skill: {type: Number, default: 0}
      },
      element: {type: String, default: "Neutral"},
      player: {type: mongoose.SchemaTypes.ObjectId, ref: "Player"},
      status: {type: String, default: "idle"},
      active: {type: Boolean, default: true},
      energy: {type: Number, default: 10},
      level: {type: Number, default: 1}
    });

    schema.query.levelBetween = function (low, high)
    {
      return this.find({level: { $gte: low, $lte: high}});
    };

    this._model = mongoose.model<SpiritDocument>('Spirit', schema);
  }

  public get model (): mongoose.Model<SpiritDocument>
  {
    return this._model;
  }

}