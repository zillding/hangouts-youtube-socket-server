import express from 'express';
import { Server } from 'http';
import { createStore } from 'redux';

import rootReducer from './reducer';
import setUpSocket from './setUpSocket';
import { log, logError } from './utils';

const app = express();
const server = Server(app);
const store = createStore(rootReducer);

setUpSocket(server, store);

// static files
app.use(express.static(`${__dirname}/../public`));

const port = process.env.PORT || 9000;

// Start  app.
server.listen(port, err => {
  if (err) {
    return logError('Error', err);
  }

  log(`Server started at port: ${port}`);
});
