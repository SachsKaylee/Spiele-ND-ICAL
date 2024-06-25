const { config } = require('dotenv');
const { pipeline, getIcal } = require('./pipeline');
const express = require('express')
config();

const app = express()
const port = parseInt(process.env.SPIELEND_PORT, 10) || 3000;

app.get('/', (req, res) => {
  res.type('icsfir');
  res.send(getIcal());
})

app.listen(port, () => {
  console.log(`Spiele-ND ICAL listening on port ${port}`)
})

pipeline();
setInterval(pipeline, parseInt(process.env.SPIELEND_INTERVAL, 10));
