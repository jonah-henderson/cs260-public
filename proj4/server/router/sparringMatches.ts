import { DB } from '../dao';
import { Router } from 'express';
import { MatchStatus } from '../../common/data/sparringMatch';

export const router = Router();

router.get('/active', async (req, res) =>
{
  let activeSpirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  let match = await DB.Models.SparringMatch.findOne({
    $or: [{contestant1Id: activeSpirit._id, contestant2Id: activeSpirit._id}],
    status: MatchStatus.Pending
  });

  if (match === null)
  {
    res.sendStatus(404);
    return;
  }

  res.status(200);
  res.json(match);

});

router.get('/:id', async (req, res) =>
{
  let id = req.params.id;

  let match = await DB.Models.SparringMatch.findById(id);

  if (match === null)
  {
    res.sendStatus(404);
    return;
  }

  res.json(match);
});