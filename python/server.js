const express = require('express');
const { createServer } = require('http');
const { default: handler } = require('@vercel/node');
const { app } = require('./app.py');

const serverlessHandler = handler(app);

const expressApp = express();
expressApp.use(express.json());

expressApp.all('*', (req, res) => {
  return serverlessHandler(req, res); 
});

const server = createServer(expressApp);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
