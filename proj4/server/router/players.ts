import { DB } from '../dao';
import { Router } from 'express';
import * as bcrypt from "bcryptjs";

export const router = Router();
export const publicRouter = Router();

publicRouter.post('/', async (req, res) =>
{
  if (req.body.password === null || req.body.password === undefined)
  {
    res.sendStatus(400);
    return;
  }

  let password = req.body.password;
  let pwHash = bcrypt.hashSync(password, 12);

  let playerData =
    {
      username: req.body.username,
      displayName: req.body.username,
      pwHash
    };

  try
  {
    let newPlayer = await DB.Models.Player.create(playerData);
    res.json(newPlayer);
  }
  catch (err)
  {
    console.log(err);
    res.json(err);
  }

});

router.get('/me', async (req, res) =>
{
  let loggedInPlayer = req["player"];

  return res.json(await DB.Models.Player.findById(loggedInPlayer._id));
});

router.get('/:id', async (req, res) =>
{
  let player = await DB.Models.Player.findById(req.params.id);

  if (player)
    return res.json(player);
  else
    res.sendStatus(404);
});