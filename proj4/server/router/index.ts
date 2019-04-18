import * as express from 'express';
import AuthRouter, {checkToken} from './auth';
import {router as PlayerRouter, publicRouter as PlayerPublicRouter } from './players';
import {router as SpiritRouter } from './spirits';
import {router as SparringRouter } from './sparring';

export const ApiRouter = express.Router();

ApiRouter.use(AuthRouter);
ApiRouter.use('/players', PlayerPublicRouter);
ApiRouter.use(checkToken);

ApiRouter.use('/spirits', SpiritRouter);
ApiRouter.use('/players', PlayerRouter);
ApiRouter.use('/sparring', SparringRouter);