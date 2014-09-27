var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(serve('./app'));

app.listen(process.env.PORT || 5000);

console.log('listening on port ' + process.env.PORT || 5000);