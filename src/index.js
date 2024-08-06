
const { app, BrowserWindow, session } = require('electron')
const { logger } = require('./log/index.js')
const path = require('path')
const { registerIpcMainHandle } = require('./ipcModule/ipcMainFns.js')
const { startStaticServer } = require('./koaServe/index.js')

try {
    function createWindow(params) {
        // Create the browser window.
        const win = new BrowserWindow({
            width: 3840,
            height: 1200,
            webPreferences: {
                contextIsolation: true,
                preload: path.join(__dirname, '/ipcModule/preload.js')
            }
        })
        // win.fullScreen = true // 开启全屏
        win.loadFile(`${app.getAppPath()}/h5/index.html`)
        win.webContents.openDevTools()
        win.webContents.on('did-finish-load', () => {
            startStaticServer(win)
        })
        registerIpcMainHandle()
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('ready', async () => {
        logger.info('触发事件：ready')
        isHandleAfterReady()
    })

    app.on('before-quit', () => {
        logger.info('触发事件：before-quit')
    })
    app.on('触发事件：browser-window-created', (event, win) => {
        win.maximize()
        win.webContents.on('did-finish-load', () => {
            logger.info('触发事件：before-quit')
            let url = win.webContents.getURL()
            logger.info(`加载[${url}]成功`)
        })
    })
    process.on('SIGTERM', () => {
        app.quit()
    })
    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            // 如果是通过浏览器协议打开，则将当前进程设置为默认协议客户端
            app.setAsDefaultProtocolClient('zgbigdata', process.execPath, [path.resolve(process.argv[1])])
        }
    } else {
        // 如果不是默认协议客户端，则设置为默认协议客户端
        app.setAsDefaultProtocolClient('zgbigdata')
    }
} catch (e) {
    logger.error(e)
    process.exit();
}

// 此方法的返回值表示你的应用程序实例是否成功取得了锁。
// 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出。
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    // 如果获取失败，说明已经有实例在运行了，直接退出
    app.quit();
} else {
    // 相当于 MacOS上的open-url 事件
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
        logger.info('通过浏览器协议打开--------')
        logger.info(commandLine)
        logger.info('通过浏览器协议打开--------')
        let params = commandLine.pop()?.split('zgbigdata://')[1]
        logger.info(`协议参数：${params}`)
        let mainWindow = BrowserWindow.getAllWindows()[0];

        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            if (params) {
                mainWindow.loadURL(params);
            }
        } else {
            createWindow(params)
        }
    })

}

const isHandleAfterReady = () => {
    // windows如果是通过url schema启动则发出时间处理
    // 启动参数超过1个才可能是通过url schema启动
    if (process.argv.length > 1) {
        if (!app.isReady()) {
            app.once("browser-window-created", () => {
                // app 未打开时，通过 open-url打开 app，此时可能还没 ready，需要延迟发送事件
                // 此段ready延迟无法触发 service/app/ open-url 处理，因为saga初始化需要时间
                app.emit("second-instance", null, process.argv);
            });
        } else {
            app.emit("second-instance", null, process.argv);
        }
    } else {
        createWindow()
    }
};