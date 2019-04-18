import * as socketIo from 'socket.io';
import { DB } from '../dao';
import { spiritNamespace } from './spirit';
import { BattleStats, defaultMoves, MatchStatus, MoveType } from '../../common/data/sparringMatch';
import { SpiritDocument } from '../dao/Spirit';
import { ISpirit } from '../../common/data/spirit';

export let sparringNamespace: socketIo.Namespace;

export default function init(io: socketIo.Server)
{
  sparringNamespace = io.of("/sparring");

  sparringNamespace.on('connection', socket =>
  {
    socket.join(socket.request.player._id);

    socket.on('searchForPartner', () => searchForPartner(socket));
    socket.on('stopSearch', () => stopSearch(socket));
    socket.on('action', (data: any) => handleAction(socket, data));
    socket.on('connectToMatch', (data: any) => connectToMatch(socket, data));
  });
}

let handles: {[key: string]: NodeJS.Timeout} = {};

async function searchForPartner(socket: socketIo.Socket)
{
  let player = socket.request.player;
  let spirit = await DB.Models.Spirit.findOne({player: player._id, active: true});


  if (spirit !== null)
  {
    if (spirit.status !== "idle")
      return socket.emit('sparringError', {err: "in other activity"});

    spirit.status = 'looking for partner';
    await spirit.save();

    spiritNamespace.to(player._id).emit('update', spirit);

    handles[spirit._id] = setInterval(async () =>
    {
      let partners = await DB.Models.Spirit.find()
        .where('status').equals('looking for partner')
        .where('_id').ne(spirit._id)
        ['levelBetween'](spirit.level - 2, spirit.level + 2);

      if (partners.length > 0)
      {
        let choice = Math.floor(Math.random() * partners.length);
        let partner = partners[choice];

        clearInterval(handles[spirit._id]);
        clearInterval(handles[partner._id]);
        delete handles[spirit._id];
        delete handles[partner._id];

        setupNewMatch(spirit, partner);
      }
    }, 5 * 1000)
  }
}

async function stopSearch(socket: socketIo.Socket)
{
  let player = socket.request.player;
  let spirit = await DB.Models.Spirit.findOne({player: player._id, active: true});

  if (spirit !== null)
  {
    if (spirit.status !== "looking for partner")
      return socket.emit('sparringError', "not searching for partner");

    clearInterval(handles[spirit._id]);
    delete handles[spirit._id];

    spirit.status = "idle";
    await spirit.save();

    spiritNamespace.to(player._id).emit('update', spirit);
  }
}

async function setupNewMatch(spirit1: SpiritDocument, spirit2: SpiritDocument)
{
  let player1 = await DB.Models.Player.findById(spirit1.player);
  let player2 = await DB.Models.Player.findById(spirit2.player);

  let newMatch =
    {
      contestant1Id: spirit1._id,
      contestant1PendingMove: null,
      contestant1Stats: {
        atk: spirit1.stats.power,
        def: spirit1.stats.endurance,
        hp: spirit1.stats.life,
        skill: spirit1.stats.skill
      },
      contestant2Id: spirit2._id,
      contestant2PendingMove: null,
      contestant2Stats: {
        atk: spirit2.stats.power,
        def: spirit2.stats.endurance,
        hp: spirit2.stats.life,
        skill: spirit2.stats.skill
      },
      status: MatchStatus.Pending,
      victor: null
    };

  let dbMatch = await DB.Models.SparringMatch.create(newMatch);

  let matchId = dbMatch._id;

  spirit1.status = "sparring";
  spirit2.status = "sparring";

  await spirit1.save();
  await spirit2.save();

  spiritNamespace.to(player1._id).emit('update', spirit1);
  spiritNamespace.to(player2._id).emit('update', spirit2);
  sparringNamespace.to(player1._id).emit('matchFound', dbMatch);
  sparringNamespace.to(player2._id).emit('matchFound', dbMatch);
}

async function connectToMatch(socket: socketIo.Socket, {matchId})
{
  socket.join(matchId);
}

async function handleAction(socket: socketIo.Socket, {actionId, spiritId, matchId}: {actionId: string, spiritId: string, matchId: string})
{
  let match = await DB.Models.SparringMatch.findById(matchId);

  if (match)
  {
    let contestant1 = await DB.Models.Spirit.findById(match.contestant1Id);
    let contestant2 = await DB.Models.Spirit.findById(match.contestant2Id);

    if (spiritId === match.contestant1Id.toString() && match.contestant1PendingMove === null)
      match.contestant1PendingMove = actionId;

    if (spiritId === match.contestant2Id.toString() && match.contestant2PendingMove === null)
      match.contestant2PendingMove = actionId;

    await match.save();
    sparringNamespace.to(matchId).emit('update', match);

    if (match.contestant1PendingMove !== null && match.contestant2PendingMove !== null)
    {
      //resolve move
      let results1 = resolveMove(match.contestant1PendingMove, contestant1, match.contestant1Stats, contestant2, match.contestant2Stats);
      let results2 = resolveMove(match.contestant2PendingMove, contestant2, match.contestant2Stats, contestant1, match.contestant1Stats);

      // calculate blocked damage
      if (results1.opponentStats.hp < 0 && results2.moverStats.tmpHp > 0 && !results1.moverStats.crit)
      {
        results1.opponentStats.hp = Math.min(results2.moverStats.tmpHp + results1.opponentStats.hp, 0);
      }

      if (results2.opponentStats.hp < 0 && results1.moverStats.tmpHp > 0 && !results2.moverStats.crit)
      {
        results2.opponentStats.hp = Math.min(results1.moverStats.tmpHp + results2.opponentStats.hp, 0);
      }

      delete results1.moverStats.tmpHp;
      delete results2.moverStats.tmpHp;

      // apply deltas
      for (let [stat, amt] of Object.entries(results1.moverStats))
      {
        match.contestant1Stats[stat] += amt;
      }

      for (let [stat, amt] of Object.entries(results1.opponentStats))
      {
        match.contestant2Stats[stat] += amt;
      }

      for (let [stat, amt] of Object.entries(results2.moverStats))
      {
        match.contestant2Stats[stat] += amt;
      }

      for (let [stat, amt] of Object.entries(results2.opponentStats))
      {
        match.contestant1Stats[stat] += amt;
      }

      match.contestant1Stats.hp = Math.min(contestant1.stats.life, match.contestant1Stats.hp);
      match.contestant2Stats.hp = Math.min(contestant2.stats.life, match.contestant2Stats.hp);

      // check win conditions

      let matchOver = false;
      if (match.contestant1Stats.hp <= 0 && match.contestant2Stats.hp > 0)
      {
        match.victor = match.contestant2Id;
        matchOver = true;
      }
      else if (match.contestant1Stats.hp > 0 && match.contestant2Stats.hp <= 0)
      {
        match.victor = match.contestant1Id;
        matchOver = true;
      }
      else if (match.contestant1Stats.hp <= 0 && match.contestant2Stats.hp <= 0)
      {
        match.victor = null;
        matchOver = true;
      }

      if (matchOver)
      {
        match.status = MatchStatus.Concluded;
        sparringNamespace.to(matchId).emit('matchOver', {winner: match.victor});
        contestant1.status = "idle";
        contestant2.status = "idle";

        if (match.victor === null)
        {
          contestant1.sparring.draws++;
          contestant2.sparring.draws++;
        }
        else if (match.victor === match.contestant1Id)
        {
          contestant1.sparring.wins++;
          contestant2.sparring.losses++;
        }
        else
        {
          contestant1.sparring.losses++;
          contestant2.sparring.wins++;
        }

        await contestant1.save();
        await contestant2.save();
      }

      let report = {
        contestant1: {
          move: match.contestant1PendingMove,
          crit: results1.moverStats.crit,
          delta: {}
        },
        contestant2: {
          move: match.contestant2PendingMove,
          crit: results2.moverStats.crit,
          delta: {}
        }
      };

      for (let key of ["atk", "def", "hp", "skill"])
      {
        report.contestant1.delta[key] = (results1.moverStats[key] + results2.opponentStats[key]);
        report.contestant2.delta[key] = (results2.moverStats[key] + results1.opponentStats[key]);
      }

      sparringNamespace.to(matchId).emit('roundReport', report);

      match.contestant1PendingMove = null;
      match.contestant2PendingMove = null;

      await match.save();
      sparringNamespace.to(matchId).emit('update', match);

      spiritNamespace.to(contestant1.player).emit('update', contestant1);
      spiritNamespace.to(contestant2.player).emit('update', contestant2);
    }
  }
}

function resolveMove(moveId: string, mover: ISpirit, moverStats: BattleStats, opponent: ISpirit, opponentStats: BattleStats)
{
  let move = defaultMoves[moveId];

  let results: {moverStats: any, opponentStats: any};
  results = {moverStats: {atk: 0, def: 0, hp: 0, skill: 0, tmpHp: 0}, opponentStats: {atk: 0, def: 0, hp: 0, skill: 0, tmpHp: 0}};

  let amt;
  switch(move.type)
  {
    case MoveType.Attack:
      amt = Math.floor(moverStats.atk / 10) + Math.floor(Math.random() * mover.level);
      amt = Math.max(amt, 1);

      let originalAtk = mover.stats.power;
      let diff = originalAtk - moverStats.atk;
      results.opponentStats.hp = -amt;
      results.moverStats.atk = diff;

      results.moverStats.crit = (Math.random() < (0.1 + 0.0009 * mover.stats.skill));

      if (results.moverStats.crit)
        results.opponentStats.hp *= 2;

      break;

    case MoveType.Brace:
      results.moverStats.tmpHp = mover.stats.endurance + Math.floor(Math.random() * mover.level);
      break;

    case MoveType.Boost:
      results.moverStats.atk = Math.floor(mover.stats.skill / 10) + Math.floor(Math.random() * mover.level);
      break;

    case MoveType.Heal:
      amt = Math.floor(mover.stats.life / 4) + Math.floor(Math.random() * mover.level);
      results.moverStats.hp = amt;
      break;

    default:
      break;
  }

  return results;
}
