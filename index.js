var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(serve('./app'));

app.listen(80);

console.log('listening on port 80');