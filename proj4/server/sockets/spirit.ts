import * as socketIo from 'socket.io'
import { DB } from '../dao';
import { trainings } from '../../common/data/training';

export let spiritNamespace: socketIo.Namespace;

export default function init(io: socketIo.Server)
{
  spiritNamespace = io.of("/spirit");

  spiritNamespace.on('connection', socket =>
  {
    socket.join(socket.request.player._id);

    socket.on('train', (data) => train(socket, data));
    socket.on('rest', () => rest(socket));
    socket.on('stopRest', () => stopRest(socket));
  });
}

async function train(socket: socketIo.Socket, data: any)
{
  let player = socket.request.player;

  let spirit = await DB.Models.Spirit.findOne({player: player._id, active: true});

  if (spirit !== null)
  {
    let trainingId = data.trainingId;

    let training = trainings[trainingId];

    if (training === undefined)
    {
      socket.emit('trainingError', {err: "bad training id"});
      return;
    }

    if (spirit.energy < training.baseCost)
    {
      socket.emit('trainingError', {err: "insufficient energy"});
      return;
    }

    if (spirit.status !== "idle")
    {
      socket.emit('trainingError', {err: "in other activity"});
      return;
    }

    let gain = training.baseAmount + Math.floor(training.baseAmount / 5) * (Math.floor(Math.random() * 5) - 2);

    // secondsPerGain = time to gain 1 point (5 pts in 60 secs = every 12 seconds)
    let secondsPerGain = Math.floor(training.baseTime / gain);

    for (let i = 1; i <= gain; i++)
    {
      if (i < gain)
      {
        setTimeout(async () =>
        {
          console.log(`adding stat gain, new total ${spirit.stats[training.stat] + 1}`);
          spirit.stats[training.stat] += 1;
          await spirit.save();

          spiritNamespace.to(player._id).emit('update', spirit);

        }, i * secondsPerGain * 1000);
      }
      else
      {
        setTimeout(async () =>
        {
          console.log(`adding final stat gain, new total ${spirit.stats[training.stat] + 1}`);

          spirit.stats[training.stat] += 1;
          spirit.energy -= training.baseCost;
          spirit.status = "idle";
          await spirit.save();

          spiritNamespace!.to(player._id).emit('update', spirit);

        }, i * secondsPerGain * 1000);
      }
    }

    spirit.status = `training (${training.display})`;
    await spirit.save();

    spiritNamespace!.to(player._id).emit('update', spirit);

    return;
  }
}

let resters: {[key: string]: NodeJS.Timeout} = {};

async function rest(socket)
{
  let player = socket.request.player;
  let spirit = await DB.Models.Spirit.findOne({player: player._id, active: true});

  if (spirit === null)
  {
    return;
  }

  if (spirit.status !== 'idle')
  {
    socket.emit('restError', {err: 'in other activity'});
    return;
  }

  if (spirit.energy === spirit.stats.endurance)
  {
    socket.emit('restError', {err: 'already rested'});
    return;
  }

  let handle = setInterval(async () =>
  {
    spirit.energy += 1;
    await spirit.save();

    spiritNamespace.to(player._id).emit('update', spirit);

    if (spirit.energy === spirit.stats.endurance)
    {
      clearInterval(handle);
      spirit.status = "idle";
      await spirit.save();

      spiritNamespace.to(player._id).emit('update', spirit);
    }
  }, 10 * 1000);

  resters[spirit._id] = handle;

  spirit.status = "resting";
  await spirit.save();

  spiritNamespace.to(player._id).emit('update', spirit);
}

async function stopRest(socket)
{
  let player = socket.request.player;
  let spirit = await DB.Models.Spirit.findOne({player: player._id, active: true});

  if (spirit === null)
    return;

  if (resters[spirit._id] !== undefined)
  {
    clearInterval(resters[spirit._id]);
    delete resters[spirit._id];

    spirit.status = "idle";
    await spirit.save();

    spiritNamespace.to(player._id).emit('update', spirit);
  }
}