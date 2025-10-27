require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener logic
let urls = [];
let id = 1;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  if (!validUrl.isWebUri(url)) {
    return res.json({ error: 'invalid url' });
  }
  const short_url = id++;
  urls.push({ original_url: url, short_url });
  res.json({ original_url: url, short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short = parseInt(req.params.short_url);
  const found = urls.find(u => u.short_url === short);
  if (found) {
    res.redirect(found.original_url);
  } else {
    res.status(404).json({ error: 'No short URL found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
