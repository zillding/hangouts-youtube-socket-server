import express from 'express';
import { Server } from 'http';
import setUpSocket from './setUpSocket';

const app = express();
const server = Server(app);

setUpSocket(server);

const port = process.env.PORT || 3000;

// Start  app.
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }

  console.log(`server started at port: ${port}`);
});
