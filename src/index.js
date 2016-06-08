import express from 'express';
import { Server } from 'http';

import setUpSocket from './setUpSocket';
import { log, logError } from './utils';

const app = express();
const server = Server(app);

setUpSocket(server);

const port = process.env.PORT || 3000;

// Start  app.
server.listen(port, err => {
  if (err) {
    return logError('Error', err);
  }

  log(`Server started at port: ${port}`);
});
