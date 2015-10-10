#!/usr/bin/env node

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    port = process.env.PORT || 1215;

app.use(logger('dev'));

app.get('/', function (req, res) {
  res.send('Hello World! This is easy-bot, https://github.com/PeterDaveHello/easy-bot');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log('easy-bot app listening at http://%s:%s', host, port);
});
