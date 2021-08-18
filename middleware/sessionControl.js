const Config = require('../config/config.json');
const connection = require('../models/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
	/**############Default Setting#############*/
	// 是否自動檢查並清除過期的會話
    clearExpired: true,
    // 清除過期會話頻率(毫秒)
    checkExpirationInterval: 900000,
    // 有效對話期限(毫秒)
    expiration: 86400000,
    // 是否創建會話數據庫表（如果尚不存在）
    createDatabaseTable: true,
    // 創建連接池時的連接數
    connectionLimit: 1,
	// 關閉商店時是否結束數據庫連接。
    // 此選項的默認值取決於是否將連接傳遞給構造函數。
    // 如果將連接對像傳遞給構造函數，則此選項的默認值為false。
    endConnectionOnClose: false,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'node_express_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}

const name = Config.session.name || "_conn.sid"
const secret = Config.session.secret || "youshiqingzhaochenjiazheng"
const sessionStore = new MySQLStore(options, connection);

// module.exports.name = name
// module.exports.secret = secret
// module.exports.sessionStore = sessionStore

module.exports.session = session({
	//key: name,
	name: name,
    secret: secret, 
	store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: options.expiration,
        expires: options.expiration,
    }
});