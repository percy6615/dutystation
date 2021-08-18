//const flash = require('connect-flash');
const connection = require('../models/database');
const Config = require('../config/config.json');

var signup_city, signup_group, signup_character;
/*
* 下面是讀取城市跟各城市單位 目的是用來給註冊頁面
* 下方query 關聯性條件非常複雜
*/

//行政區
const sql01 = "SELECT c.city_name, c.city_desc FROM `org_city`c, `org_group`g, `org_group_character`ogc WHERE c.city_name = g.city_name AND g.group_name = ogc.group_name AND c.show && g.show && ogc.show = 1 GROUP BY c.city_name";
//單位#行政區對照
const sql02 = "SELECT c.city_name, g.group_name, g.group_desc FROM `org_city`c, `org_group`g, `org_group_character`ogc  WHERE c.city_name = g.city_name AND g.group_name = ogc.group_name AND c.show && g.show && ogc.show = 1 GROUP BY g.group_name";
//職位#單位與職位對照 
const sql03 = "SELECT g.group_name, ch.char_name, ch.char_desc FROM `org_city`c, `org_group`g, `org_group_character`ogc, `org_character`ch WHERE c.city_name = g.city_name AND g.group_name = ogc.group_name AND ch.char_name = ogc.char_name AND c.show && g.show && ogc.show = 1";

connection.query(sql01, function (err, rows, fields) {
    if (!err) signup_city = rows;
});
connection.query(sql02, function (err, rows, fields) {
    if (!err) signup_group = rows;
});
connection.query(sql03, function (err, rows) {
    if (!err) signup_character = rows;
});


module.exports = function (app, passport) {
    
    app.locals.title = `${Config.app.unit}-${Config.app.platform}`;
    app.locals.unit = Config.app.unit;
    app.locals.platform = Config.app.platform;
	
    // 首頁 ===============================
    app.get('/', (req, res) => { //導向
        res.redirect('verify');
    });

    // 登入頁
    app.get('/login', function (req, res) { //導向網頁即回傳錯誤訊息用
        res.render('login.ejs', {
            "loginMessage": req.flash('loginMessage')
        });
    });

    // 登入表單處理
    app.post('/login', passport.authenticate('local-login', { //分隊登入使用passpor認證
		successRedirect: '/verify', // 認證正確導向正確網頁
		failureRedirect: '/login', // 認證錯誤導向錯誤網頁
		failureFlash: true // 允許錯誤回傳訊息
	}));

    // 註冊頁
    app.get('/signup', function (req, res) { //導向網頁即回傳錯誤訊息用
        res.render('signup.ejs', {
            "signup_select_opt": { signup_city, signup_group, signup_character },
            //signupError: , //顯示錯誤資訊array
            //signupSuccess: , //顯示註冊成功資訊
            "signupMessage": { "failed": req.flash('error_messages'), "complete": req.flash('success_message')}
        });
    });

    // 註冊表單處理
    app.post('/signup', passport.authenticate('local-signup', { //註冊帳號使用passport認證
        successRedirect: '/signup', // 認證正確導向正確網頁
        failureRedirect: '/signup', // 認證錯誤導向錯誤網頁
        failureFlash: true // 錯誤回傳訊息
	}));

    // 登出
    app.get('/logout', function (req, res) {
        req.logout();
		res.clearCookie('io');
        res.redirect('/');
    });
    
    /*
    // 404顯示處理
    app.use('/*', function (req, res) { //code:404 review
        res.status(404).send("Sorry can't find that!");
    });
    */
};
