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

router.get('/active/train', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit !== null)
  {
    let trainingId = req.query.id;

    let training = trainings[trainingId];

    if (training === undefined)
    {
      res.status(400);
      res.json({err: "bad training id"});
      return;
    }

    if (spirit.energy < training.baseCost)
    {
      res.status(400);
      res.json({err: "insufficient energy"});
      return;
    }

    if (spirit.status !== "idle")
    {
      res.status(400);
      res.json({err: "in other activity"});
      return;
    }

    let gain = training.baseAmount + Math.floor(training.baseAmount / 5) * (Math.floor(Math.random() * 5 ) - 2);

    // secondsPerGain = time to gain 1 point (5 pts in 60 secs = every 12 seconds)
    let secondsPerGain = Math.floor(training.baseTime / gain);

    for (let i = 1; i <= gain; i++)
    {
      if (i < gain)
      {
        setTimeout(async () => {
          console.log(`adding stat gain, new total ${spirit.stats[training.stat] + 1}`);
          spirit.stats[training.stat] += 1;
          await spirit.save();
        }, i * secondsPerGain * 1000);
      }
      else
      {
        setTimeout(async () => {
          console.log(`adding final stat gain, new total ${spirit.stats[training.stat] + 1}`);
          spirit.stats[training.stat] += 1;
          spirit.energy -= training.baseCost;
          spirit.status = "idle";
          await spirit.save();
        }, i * secondsPerGain * 1000);
      }
    }

    spirit.status = `training (${training.display})`;
    await spirit.save();

    res.status(200);
    res.json(spirit);

    return;
  }
});

// global variables, the poor man's memcached
const resters: {[key: string]: NodeJS.Timeout} = {};

router.get('/active/rest', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit === null)
  {
    res.sendStatus(404);
    return;
  }

  if (spirit.status !== 'idle')
  {
    res.status(400);
    res.json({err: 'in other activity'});
    return;
  }

  if (spirit.energy === spirit.stats.endurance)
  {
    res.status(400);
    res.json({err: 'already rested'});
    return;
  }

  let handle = setInterval(async () =>
  {
    spirit.energy += 1;
    await spirit.save();

    if (spirit.energy === spirit.stats.endurance)
    {
      clearInterval(handle);
      delete resters[spirit._id];
      spirit.status = "idle";
      await spirit.save();
    }
  }, 10 * 1000);

  resters[spirit._id] = handle;

  spirit.status = "resting";
  await spirit.save();

  res.sendStatus(200);

});

router.get('/active/stopRest', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit === null)
  {
    res.sendStatus(404);
    return;
  }

  if (resters[spirit._id] !== undefined)
  {
    clearInterval(resters[spirit._id]);
    delete resters[spirit._id];
    spirit.status = "idle";
    await spirit.save();
  }

  res.sendStatus(200);
});

router.get('/active/startSparring', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit === null)
  {
    res.sendStatus(404);
    return;
  }

  spirit.status = "looking for partner";
  await spirit.save();

  res.json(spirit);
});

router.get('/active/findSparringPartner', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit === null)
  {
    res.sendStatus(404);
    return;
  }

  if (spirit.status !== "looking for partner")
  {
    res.status(400);
    res.json({err: "not currently looking for partners"});
    return;
  }

  let existingMatch = await DB.Models.SparringMatch.findOne(
    {
      $or: [{contestant1Id: spirit._id}, {contestant2Id: spirit._id}]
    });

  if (existingMatch !== null)
  {
    res.json({matchId: existingMatch._id});
    return;
  }

  let requestedLevel = req.query.level;

  let partner = await DB.Models.Spirit.findOne()
    .where('status').equals('looking for partner')
    .where('_id').ne(spirit._id)
    ['levelBetween'](requestedLevel - 2, requestedLevel + 2);

  if (partner === null || partner.length == 0)
  {
    res.sendStatus(404);
    return;
  }
  else
  {
    // dunno why we get the array back with findOne
    partner = partner[0];
    spirit.status = "sparring";
    partner.status = "sparring";

    let newMatch: ISparringMatch =
    {
      contestant1Id: spirit._id,
      contestant2Id: partner._id,
      contestant1NextMove: null,
      contestant1PendingMove: null,
      contestant1Stats:
        {
          atk: spirit.stats.power,
          def: spirit.stats.endurance,
          hp:  spirit.stats.life
        },
      contestant2NextMove: null,
      contestant2PendingMove: null,
      contestant2Stats:
        {
          atk: partner.stats.power,
          def: partner.stats.endurance,
          hp:  partner.stats.life
        },
      status: MatchStatus.Pending,
      victor: null
    };

    let newMatchDb = await DB.Models.SparringMatch.create(newMatch);
    await spirit.save();
    await partner.save();

    res.json({matchId: newMatchDb._id});
  }
});

router.get('/active/cancelSparring', async (req, res) =>
{
  let spirit = await DB.Models.Spirit.findOne({player: req["player"]._id, active: true});

  if (spirit === null)
  {
    res.sendStatus(404);
    return;
  }

  if (spirit.status === "looking for partner")
  {
    spirit.status = "idle";
    await spirit.save();
    res.sendStatus(200);
    return;
  }
  else if (spirit.status === "sparring")
  {
    let match = await DB.Models.SparringMatch.findOne(
      {
        $or: [{contestant1Id: spirit._id}, {contestant2Id: spirit._id}]
      });

    let victorId = match.contestant1Id === spirit._id ? match.contestant2Id : match.contestant1Id;
    let partner = await DB.Models.Spirit.findById(victorId);

    spirit.status = "idle";
    partner.status = "idle";

    match.status = MatchStatus.Forfeited;
    match.victor = victorId;
    await match.save();
    await spirit.save();
    await partner.save();

    res.sendStatus(200);
  }
});