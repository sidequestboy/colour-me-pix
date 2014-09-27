var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(serve('./app'));

app.listen(Number(process.argv[2]));

console.log('listening on port ' + Number(process.argv[2]));