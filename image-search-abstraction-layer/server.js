// server.js

/* ================== SETUP ================== */

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');

const search = require('./search');
const searchTerm = require('./models/searchTerm');

app.use(bodyParser.json());
app.use(cors());


/* ================== DB CONNECTION ================== */

const MONGODB_URI = `mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DB}`;

// connect to DB if running locally:
// mongoose.connect('mongodb://localhost/searchTerms');

// connect to mLab
mongoose.connect(MONGODB_URI);

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* ================== ROUTES ================== */

// get all UNIQUE search terms stored in DB, sorted by most recent date
app.get('/api/recent', (req, res, next) => {

  searchTerm.aggregate(
    [
      { "$group": {
        _id: "$searchVal",
        doc: {$first: "$$ROOT"}
      }},
      { "$sort": { "searchDate": -1 } },
    ],
    (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      console.log(data);
      res.json(data);
    }
  );
});

// new image search
app.get('/api/search/:searchVal*', (req, res, next) => {

  const { searchVal } = req.params;
  const { offset } = req.query;

  const data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });

  data.save(err => {
    if (err) {
      console.log(`Error Saving to database: ${err}`);
    }
  });

  search(searchVal, offset, (data) => {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    data.baseUrl = baseUrl;
    res.json(data);
  });
});


// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res) => {
  console.log('root route, serving client');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = http.createServer(app);
const port = process.env.PORT || 8080;
app.set('port', port);
server.listen(port, () => console.log(`Server listening on localhost:${port}`));
