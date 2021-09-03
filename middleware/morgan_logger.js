const logger = require('morgan');
const fs = require('fs');
const FileStreamRotator = require('file-stream-rotator');

const logDirectory = __dirname + '/logs'
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
	filename: logDirectory + '/access-%DATE%.log',
	frequency: 'daily',
	verbose: false
})

module.exports = logger('combined', {stream: accessLogStream})