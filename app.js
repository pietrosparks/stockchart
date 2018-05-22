const express = require('express');
const app = express();
const path = require('path');
const serveStatic = require('serve-static');
const server = require('http').Server(app);
const history = require('connect-history-api-fallback');
const port = process.env.PORT || 5000;
app.use(serveStatic(__dirname + "./dist"));
app.use(history({verbose:true}));
app.listen(port);
console.log('server started '+ port);

