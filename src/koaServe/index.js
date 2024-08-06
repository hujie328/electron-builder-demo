const { app } = require('electron')
const path = require('path')
const koa2 = require("koa")
const http = require('http');
const static = require('koa-static');
const { logger } = require('../log/index.js')

let serve = null
const startStaticServer = (win) => {
    if (serve) return
    serve = new koa2()
    serve.use(static(path.join(app.getAppPath(), '../assets'), {
        index: false,    // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
        hidden: false,   // 是否同意传输隐藏文件
        defer: true      // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
    }))
    // 启用一个不常用的端口
    let httpServe = http.createServer(serve.callback())
    let port = 50080
    httpServe.listen(port, () => {
        logger.info(`服务器启动成功，端口号：${port}`)
        win.webContents.send("serve-succeed", `http://localhost:${port}`)
    })
    httpServe.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger.error(`${port}端口被占用`)
            port++
            httpServe.close();
            httpServe.listen(port)
        } else {
            logger.error(err)
        }
    })
}
module.exports = {
    startStaticServer
}