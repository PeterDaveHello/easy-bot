#!/usr/bin/env node

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    config = require('../config'),
    port = process.env.PORT || 1215;

app.use(logger('dev'));

app.get('/', function (req, res) {
  res.send('Hello World! This is easy-bot, https://github.com/PeterDaveHello/easy-bot');
});

app.post('/', jsonParser, function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var gh_event, gh_secret, allow_event;
  allow_events = ['pull_request', 'pull_request_review_comment']
  try {
    gh_event = req.headers["x-github-event"];
    gh_secret = req.headers["x-hub-signature"];
  } catch (e) {
    console.dir("Error occured: " + e);
    gh_event = gh_secret = undefined;
  }
  if (allow_events.indexOf(gh_event) === -1) {
    res.send("Event not allowed!! We currently only support " + allow_events.join(', ') + " event(s)!");
  } else if (gh_secret !== 'sha1=' + config.gh_secret) {
    res.send("Auth failed!");
  } else {
    var gh_issue = {};
    try {
      var temp = req.body;
      gh_issue['action'] = temp.action;
      gh_issue['number'] = temp.number;
      gh_issue['state'] = temp.state;
      gh_issue['issuer'] = temp.sender.login;
    } catch (e) {
      console.dir("Error occured: " + e);
    }
  }
});

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log('easy-bot app listening at http://%s:%s', host, port);
});
