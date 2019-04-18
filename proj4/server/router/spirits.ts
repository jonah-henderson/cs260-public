import { DB } from '../dao';
import { Router } from 'express';
import { trainings } from '../../common/data/training';
import { ISparringMatch, MatchStatus } from '../../common/data/sparringMatch';

export const router = Router();

router.post('/', async (req, res) =>
{
  let name = req.body.name;

  if (! /[a-zA-Z]+/.test(name))
  {
    res.sendStatus(400);
    return;
  }

  let newSpirit = await DB.Models.Spirit.create({name});

  newSpirit.player = req["player"]._id;
  newSpirit.stats.power     = 10 + Math.floor(Math.random() * 5) - 2;
  newSpirit.stats.skill     = 10 + Math.floor(Math.random() * 5) - 2;
  newSpirit.stats.endurance = 10 + Math.floor(Math.random() * 5) - 2;
  newSpirit.stats.life      = 10 + Math.floor(Math.random() * 5) - 2;
  newSpirit.energy = newSpirit.stats.endurance;

  await newSpirit.save();

  res.status(201);
  res.json(newSpirit);
});

router.get('/active', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit !== null)
  {
    res.json(spirit);
    return;
  }

  res.sendStatus(404);
});

router.get('/:id', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findById(req.params.id);

  if (spirit !== null)
    return res.json(spirit);

  res.sendStatus(404);
});