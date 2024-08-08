const { app, dialog } = require('electron')
const { logger } = require('../log/index.js')


const { autoUpdater } = require('electron-updater')
const checkUpdate = () => {
    autoUpdater.setFeedURL('http://172.30.1.160:3000/')  //设置要检测更新的路径	
    //检测更新
    autoUpdater.checkForUpdates()

    //监听'error'事件
    autoUpdater.on('error', (err) => {
        logger.error(`监听更新失败：${err}`)
    })

    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
        logger.info('发现新版本 found new version')
    })

    //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '应用更新',
            message: '发现新版本，是否更新？',
            buttons: ['是', '否']
        }).then((buttonIndex) => {
            if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
                isPreventClose = false
                autoUpdater.quitAndInstall()
                app.quit()
            }
        })
    })
}

module.exports = {
    checkUpdate
}