import * as express from 'express';
import { ApiRouter } from './router';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';

let app = express();

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));

app.listen(3000, () =>
{
  console.log(`Server listening on port 3000`);
});

app.use('/nocturne-spirit/api', ApiRouter);