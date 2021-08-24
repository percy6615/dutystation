// load up the user model
const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../models/database');
// const regularDepartment = require('../models/departmentLayer');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // 核心部分解釋 》》 https://zybuluo.com/FunC/note/1088513

    // 判斷資料存取地方 空值儲存於註冊資料表內，反之儲存於帳號資料表內
    passport.serializeUser((user, done) => { 
        // console.log('serializeUser', user)
        // 將帳號資訊及資料庫id加進session 
        return done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser((user, done) => {
        // console.log('deserializeUser', user)
        // let sql = "SELECT u.USERNAME, u.FULLNAME, u.GROUPCITY, u.GROUPNAME, u.GROUPCHARACTER, u.PHONE, u.CHECKFINISH, u.ADMIN, ogm.manager AS GROUPMANAGER, ogm.level AS GROUPLEVEL FROM `disaster_account`u INNER JOIN `org_group_manager`ogm ON u.GROUPNAME = ogm.group_name  WHERE u.USERNAME = ? AND u.CHECKFINISH = 1 LIMIT 1";
        // connection.query(sql, [user.USERNAME], (err, rows) => {
        //     if (err || !rows.length) return done(err, false);
        //     if (rows.length) return done(err, rows[0]);
        // });
        return done(null, user);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({ //註冊帳號
            //本地策略:讀取username及password欄位判斷資料
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, username, password, done) => {
            var errorMessages = {}
            var reqData = {
                "USERNAME": {
                    "regular": '^([\\w]+){4,}$',
                    "subtext": '帳號',
                    "subvalue": req.body.username
                },
                "PASSWORD": {
                    "regular": '^((?=.*[A-Za-z0-9])(?=.*[a-z]))^.{4,30}$',
                    "subtext": '密碼',
                    "subvalue": req.body.password
                },
                "PASSWORD2": {
                    "regular": '^((?=.*[A-Za-z0-9])(?=.*[a-z]))^.{4,30}$',
                    "subtext": '二次確認密碼',
                    "subvalue": req.body.password2
                },
                "FULLNAME": {
                    "regular": '^[\\u4e00-\\u9fa5_a-zA-Z]+$',
                    "subtext": '姓名',
                    "subvalue": req.body.fullname
                },
                "PHONE": {
                    "regular": '^09[0-9]{8}$',
                    "subtext": '電話',
                    "subvalue": req.body.userphone
                },
                "GROUPCITY": {
                    "subtext": '行政區',
                    "subvalue": req.body.groupcity
                },
                "GROUPNAME": {
                    "subtext": '單位',
                    "subvalue": req.body.groupname
                },
                "GROUPCHARACTER": {
                    "subtext": '職位',
                    "subvalue": req.body.groupcharacter
                }
            }

            //二次確認密碼檢查
            if (reqData.PASSWORD.subvalue !== reqData.PASSWORD2.subvalue) {
                return done(null, false, req.flash('error_messages', '兩次密碼不相同.'));
            }

            Object.keys(reqData).forEach((keys) => {
                //欄位空白檢查
                if (!reqData[keys].subvalue || reqData[keys].subvalue == '') {
                    errorMessages.push(reqData[keys].subtext + '不能空白')
                }
                //資料欄位正規化確認
                let re = new RegExp(reqData[keys].regular);
                if (reqData[keys].regular) {
                    if (!re.test(reqData[keys].subvalue)) {
                        console.log(reqData[keys].subvalue, re, re.test(reqData[keys].subvalue))
                        console.log(Date(), '\n接收到未知的註冊內容 - 正規化錯誤', reqData[keys].subvalue)
                        errorMessages = ['Error'];
                    }
                }
            })
            //errorMessages is array.
            if (errorMessages.length) return done(null, false, req.flash('error_messages', errorMessages));

            //各行政區與隸屬單位人職位確認
            // var resCity = regularDepartment.getLayers().find((item) => {
            //     return item.city_name === reqData.GROUPCITY.subvalue
            // })
            // if (!resCity) {
            //     console.log(Date(), '\n接收到未知的註冊內容 - 行政區錯誤', reqData.GROUPCITY.subvalue)
            //     return done(null, false, req.flash('error_messages', '行政區錯誤'));
            // } else {
            //     let resGroup = resCity.group_name.find((item) => {
            //         return item.subgroup === reqData.GROUPNAME.subvalue
            //     })
            //     if (!resGroup) {
            //         console.log(Date(), '\n接收到未知的註冊內容 - 單位錯誤', reqData.GROUPNAME.subvalue)
            //         return done(null, false, req.flash('error_messages', '單位錯誤'));
            //     } else {
            //         if (resGroup.subchar.indexOf(reqData.GROUPCHARACTER.subvalue) < 0) {
            //             console.log(Date(), '\n接收到未知的註冊內容 - 職位錯誤', reqData.GROUPCHARACTER.subvalue)
            //             return done(null, false, req.flash('error_messages', '職位錯誤'));
            //         }

            //     }
            // }

            //確認帳號名稱是否重複
            let querychkun = "SELECT USERNAME FROM disaster_account WHERE USERNAME = ? LIMIT 1";
            connection.query(querychkun, [reqData.USERNAME.subvalue], (err, result) => {
                if (result.length) {
                    return done(null, false, req.flash('error_messages', '此帳號名稱已註冊，無法登入？ 請洽詢相關服務人員'));
                } else { //加入帳號於註冊資料表內
                    const newUserMysql = { //帳號及密碼(加密) 方便下方資料庫新增時使用所作欄位
                        USERNAME: reqData.USERNAME.subvalue,
                        PASSWORD: bcrypt.hashSync(reqData.PASSWORD.subvalue, null, null), // use the generateHash function in our user model
                        FULLNAME: reqData.FULLNAME.subvalue,
                        PHONE: reqData.PHONE.subvalue,
                        GROUPCITY: reqData.GROUPCITY.subvalue,
                        GROUPNAME: reqData.GROUPNAME.subvalue,
                        GROUPCHARACTER: reqData.GROUPCHARACTER.subvalue,
                    };
                    //將上方合併資料放進signup_all 資料表內
                    let instersql = 'INSERT INTO disaster_account SET ?';
                    connection.query(instersql, [newUserMysql], (err, rows) => {
                        if (err) throw err
                        console.log("We got a new registered user!", newUserMysql.USERNAME, newUserMysql.FULLNAME);
                        return done(null, newUserMysql, req.flash('success_message', '申請成功！ 等待人員審核'));
                    });
                };
            });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({ //分隊登入帳號
            //本地策略:讀取username及password欄位判斷資料
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) { //判斷是否有此帳號及內容判斷
            connection.query("SELECT * FROM disaster_account WHERE USERNAME = ? LIMIT 1", [username], function (err, rows) {
                if (err) return done(null, false);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', '查無此帳號'));
                } else {
					let userData = rows[0]
                    if ( !bcrypt.compareSync(password, userData.PASSWORD) ) return done(null, false, req.flash('loginMessage', '密碼錯誤.'));
                    if ( !Boolean(userData.CHECKFINISH) ) return done(null, false, req.flash('loginMessage', '審核中...'));
                    return done(null, { "userinfo": userData });
                }
            });
        }));
};