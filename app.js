var express = require('express');
var path = require('path');
var app = express();
var proxy=require('http-proxy-middleware')

app.use(express.static(path.join(__dirname)));

app.use('/web/*', proxy('/web', { target: 'http://118.190.84.87:9081',changeOrigin: true}));//api子目录下的都是用代理

app.listen(3002);