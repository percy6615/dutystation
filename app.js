//var http = require('http');

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportSocketIo = require("passport.socketio");
const flash = require('connect-flash');
const fetch = require('node-fetch');
const favicon = require('serve-favicon')
const moment = require('moment');
const { base64encode, base64decode } = require('nodejs-base64');
const paths = require('./config/paths');
//const SiteName = require('./sitename.json');
const Config = require('./config/config.json');
const sessionControlMiddleware = require('./middleware/sessionControl');
const accessControlMiddleware = require('./middleware/accessControl');
const rateLimitMiddleware = require('./middleware/rateLimitConfig');

//const morganLoggerMiddleware = require('./middleware/morganLogger');  // log 落地
const loginRouter = require('./routes/login_router');  // express first router

const passportRouter = require('./routes/passport');    // passport 認證過程
//const missionHandle = require('./models/missionHandle'); // 災情處理
const connection = require('./models/database');    // query db
//const userPermission = require('./models/userPermission');

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || Config.app.port || 8080; //這是PORT 這是PORT 這是PORT 這是PORT 這是PORT 這是PORT 這是PORT 
const io = require('socket.io').listen(server);
const fs = require('fs');
var title_edit = "";
fs.readFile("./config/title_edit.txt", 'utf8', function (err, data) {
  if (err) throw err;
  title_edit = data;

});
server.listen(port, () => {
  console.log(`running at ${server.address().address}:${server.address().port}`);
})

// routeMiddleware engine setup
app.use(helmet());
app.use(accessControlMiddleware); // required for accessControl
app.use(sessionControlMiddleware.session); // required for sessionControl to passport
//app.use(rateLimitMiddleware.allLimiter)
// view engine setup
app.set('views', paths.appView);
app.set('view engine', 'ejs');
//app.use(logger('dev')); // command line show express log
//app.use(morganLoggerMiddleware); // command line show express log
app.use(express.static(paths.appPublic));
app.use(favicon(path.join(paths.appPublic, '/static/icon/favicon-510x510.png')));
app.use(bodyParser.json({ limit: '256mb' }));
app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }));
app.use(cookieParser()); // read cookies (認證需要用到)
app.use(passport.initialize()); // 啟用 passport
app.use(flash()); // 回饋訊息處理 session
app.use(passport.session()); // 紀錄 session
app.use((err, req, res, next) => {
  console.error(req.ip);
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

//express custom require
passportRouter(passport); // do serial passport for configuration
loginRouter(app, passport); // load our routes and pass in our app and fully configured passport

// socketio Middleware setup
const onAuthorizeSuccess = (data, accept) => {
  //console.log('successful connection to socket.io');
  // accept connection
  return accept();
}
const onAuthorizeFail = (data, message, error, accept) => {
  //console.log('failed connection to socket.io:', message);
  // send the (not-fatal) error-message to the client and deny the connection
  return accept(new Error(message));
}
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  passport: passport,
  key: sessionControlMiddleware.name,       // the name of the cookie where express/connect stores its session_id
  secret: sessionControlMiddleware.secret,    // the session_secret to parse the cookie
  store: sessionControlMiddleware.sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success: onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));
const staticSetting = {
  io: {
    dashboard: '/dashboard',
    dutystation: '/dutystation',
    strDisconnectText: '已斷開連接，此帳號已在另一處使用。'
  },
  mission: {
    areaSelect: Config.app.areaSelect ? Config.app.areaSelectValue : ['全區']
  },
  error: {
    string: '無法顯示'
  }
}
// passport 是否認證完成
const isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login'); //未登入帳號直接導回

// 值班台
// req.query url param
app.get(['/main'], (req, res) => {
  // , isAuthenticated
  res.render('main.ejs', {
    // "FULLNAME": req.userinfo.user.FULLNAME || staticSetting.error.string,

  });

});

app.get(['/test'], (req, res) => {
  // , isAuthenticated
  res.render('test.ejs', {
    // "FULLNAME": req.userinfo.user.FULLNAME || staticSetting.error.string,

  });

});