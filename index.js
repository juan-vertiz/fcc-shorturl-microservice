require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;
const urls = [];

app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const nextShortUrl = urls.length + 1;
  const originalUrl = new URL(req.body.url);
  dns.lookup(originalUrl.hostname, (error, address, family) => {
    if (error) {
      res.send({error: 'invalid url'});
    } else {
      const urlEntry = {
        original_url: originalUrl.href,
        short_url: nextShortUrl
      };
      urls.push(urlEntry);
      res.send(urlEntry);
    }
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const urlEntry = urls.find(element => element.short_url === Number(req.params.shortUrl));
  if (urlEntry === undefined) {
    res.send({error: 'not found'});
  } else {
    res.redirect(urlEntry.original_url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
