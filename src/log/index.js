const { app } = require('electron')
const path = require('path')
const logger = require('electron-log')
let logPath = path.resolve(app.getPath("exe"), "../log/log_info.log")

logger.transports.file.resolvePathFn = () => logPath

logger.transports.console.format = '{h}:{i}:{s} {level} {text}';

module.exports = {
    logger
}