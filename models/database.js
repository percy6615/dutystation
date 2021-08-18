const mysql = require("mysql");
const dbConfig = require('../config/config.json').server.mysqlConnObj;

const pool = mysql.createPool(dbConfig)

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
            case "ECONNREFUSED", "ETIMEDOUT":
                console.log('MySQL連線異常，終止程式')
                //pool.end();
                process.exit();
                break;
            case "PROTOCOL_CONNECTION_LOST":
                break;
            case "ER_CON_COUNT_ERROR":
                break;
            default:
                console.log(err.code)
        }
    } else {
        console.log('Connect MySQL database Successful')
    }
})

pool.on('connection', (connection) => {
        connection.query('SET SESSION auto_increment_increment=1');
    })
    .on('acquire', (connection) => {
        //console.log('Connection %d acquired', connection.threadId);
    })
    .on('enqueue', () => {
        //console.log('Waiting for available connection slot');
    })
    .on('release', (connection) => {
        //console.log('Connection %d released', connection.threadId);
    })
    .on('error', () => {});

module.exports = pool