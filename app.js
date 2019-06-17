//使用express构建web服务器
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require("cors");
/*引入路由模块*/
const flight = require('./routes/flight.js');
const pltk = require('./routes/pltk.js');
const user = require('./routes/user.js');
const admin = require('./routes/admin.js');
//创建服务器
var app = express();
//处理跨域请求
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8000', 'http://127.0.0.1:8000', 'http://176.233.2.49:8080','http://176.233.2.37:8080','http://176.233.2.59'],
  credentials: true
}))
// 监听端口
app.listen(3000);
//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 使用session
app.use(session({
  secret: '128位字符串',
  cookie: { maxAge: 1000 * 60 * 60 * 24 },//过期时间ms
  resave: true,
  saveUninitialized: true
}));//将服务器的session，放在req.session中

app.use('/flight', flight);
app.use('/pltk', pltk);
app.use('/user', user);
app.use('/admin', admin);