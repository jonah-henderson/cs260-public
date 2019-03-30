import { DB } from '../dao';
import { Request, Response, Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();

interface Token
{
  playerId: string
}

router.post('/tokens', async (req, res) =>
{
  let username = req.body.username;
  let password = req.body.password;

  let player = await DB.Models.Player.findOne({username: username.toLowerCase()});

  if (player === null)
  {
    console.log("couldn't find player", username, password);
    res.sendStatus(404);
    return;
  }

  if (!bcrypt.compareSync(password, player.pwHash))
  {
    res.sendStatus(401);
    return;
  }

  let tokenData =
  {
    playerId: player._id,
  };

  let secret = process.env['NS_TOKEN_SECRET'];

  let token = jwt.sign(tokenData, secret, {expiresIn: 60 * 60 * 9999});

  player.tokens.push(token);
  await player.save();

  res.send(token);
});

router.delete('/tokens/:token', async (req, res) =>
{
  let token = req.params.token;

  try
  {
    let decoded = (jwt.verify(token, process.env['NS_TOKEN_SECRET']) as Token);
    let player = await DB.Models.Player.findById(decoded.playerId);

    if (player === null)
    {
      res.sendStatus(404);
      return;
    }

    if (player.tokens.indexOf(token) !== -1)
    {
      player.tokens.splice(player.tokens.indexOf(token), 1);
      await player.save();

      res.sendStatus(200);
      return;
    }
    else
    {
      res.sendStatus(404);
      return;
    }
  }
  catch (err)
  {
    res.json(err);
  }
});

export async function checkToken(req: Request, res: Response, next)
{
  let authHeader = req.headers['authorization'];

  if (authHeader === null || authHeader === undefined)
  {
    res.sendStatus(401);
    return;
  }

  let token = authHeader.split(' ')[1];

  try
  {
    let decodedToken = (jwt.verify(token, process.env['NS_TOKEN_SECRET']) as Token);

    req["player"] = await DB.Models.Player.findById(decodedToken.playerId);

    next();

  } catch (err)
  {
    res.sendStatus(401);
  }

}

export default router;