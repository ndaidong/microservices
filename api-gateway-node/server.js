// server.js

const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const {info, error} = require('./utils/logger');

const {
  name,
  version,
  host,
  port,
} = require('./service.json');

const ENV = process.env || {};
const FEEDPARSER_SERVICE_URL = ENV.FEEDPARSER_SERVICE_URL;
const ARTICLEPARSER_SERVICE_URL = ENV.ARTICLEPARSER_SERVICE_URL;

const startAt = (new Date()).toUTCString();

const app = express();
app.disable('x-powered-by');

const onError = (err, req, res) => {
  error(`${req.method} ${req.path} --> ${String(err)}`);
  return res.status(500).json({
    status: 'error',
    error: 'Service Error',
    message: String(err),
  });
};

const onProxyReq = (proxyReq, req) => {
  info(`${req.method} ${req.path} --> Forwarding`);
};

app.get('/', (req, res) => {
  info(`${req.method} ${req.path} --> Default endpoint`);
  return res.json({
    service: name,
    version,
    startAt,
  });
});

// add proxy for FeedParser service
app.use(createProxyMiddleware(FEEDPARSER_SERVICE_URL, {onError, onProxyReq, onProxyRes: (proxyRes, req) => {
  proxyRes.headers['service'] = 'FeedParser service';
  info(`${req.method} ${req.path} --> Done`);
}, logLevel: 'error'}));

// add proxy for ArticleParser service
app.use(createProxyMiddleware(ARTICLEPARSER_SERVICE_URL, {onError, onProxyReq, onProxyRes: (proxyRes, req) => {
  proxyRes.headers['service'] = 'ArticleParser service';
  info(`${req.method} ${req.path} --> Done`);
}, logLevel: 'error'}));


app.use((req, res) => {
  error(`${req.method} ${req.path} --> 404`);
  return res.status(404).json({
    status: 'error',
    error: '404 Not Found',
    message: `The endpoint \`${req.path}\` does not exist!`,
  });
});

app.use((err, req, res) => {
  error(`${req.METHOD} ${req.path} --> ${String(err)}`);
  return res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    message: String(err),
  });
});

const onServerReady = () => {
  info(`${name} started at "http://${host}:${port}"`);
};

app.listen(port, host, onServerReady);
