const { ipcMain, app } = require('electron')
const { logger } = require('../log/index.js')
const { store } = require('../store/index.js')

const registerIpcMainHandle = (win) => {
    ipcMain.on('electron-win-load', (event, params) => {
        logger.info(`electron-win-load:-->参数-->[${params}]`)
        store.set('data_center_access_token', params)
        win.loadURL(`file:///${app.getAppPath()}/h5/index.html#/overview/index`)
    })

    ipcMain.handle('get-data_center_access_token', (event, params) => {
        return store.get('data_center_access_token') || ""
    })

    ipcMain.on('clean-cookies', (event) => {
        const options = {
            storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
        }
        logger.info(`clean-cookies:--->token过期清除内核缓存`)
        win.webContents.session.clearCache()
        // 清除缓存，很重要，出现了接口请求token永远不变的情况
        win.webContents.session.clearStorageData(options)
    })
}

module.exports = {
    registerIpcMainHandle
}