#!/usr/bin/env node

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    request = require('sync-request'),
    request_options = {
      'headers': {
        'user-agent': 'easy-bot by Peter Dave Hello'
      }
    },
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
      gh_issue['changed_files'] = [];
      switch (gh_event) {
        case 'pull_request':
        case 'pull_request_review_comment':
          gh_issue['is_pr'] = true;
          var gh_files_url = temp.pull_request['_links'].self.href + '/files';
          gh_issue['changed_files'] = JSON.parse(request('GET', gh_files_url, request_options).getBody('utf8'));
          break;
        default:
          gh_issue['is_pr'] = false;
      }
    } catch (e) {
      console.dir("Error occured: " + e);
    }
  }
});

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log('easy-bot app listening at http://%s:%s', host, port);
});
