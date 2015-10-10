#!/usr/bin/env node

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    port = process.env.PORT || 1215;

app.use(logger('dev'));

app.get('/', function (req, res) {
  res.send('Hello World! This is easy-bot, https://github.com/PeterDaveHello/easy-bot');
});

app.post('/', jsonParser, function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var gh_event, gh_secret;
  try {
    gh_event = req.headers["x-github-event"];
    gh_secret = req.headers["x-hub-signature"];
  } catch (e) {
    gh_event = gh_secret = undefined;
  }
  res.send(JSON.stringify(req.body, null, 2));
});

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log('easy-bot app listening at http://%s:%s', host, port);
});
