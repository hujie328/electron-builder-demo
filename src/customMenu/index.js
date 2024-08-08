const { Menu, app, BrowserWindow } = require('electron')

const customMenuHandle = () => {
    //创建菜单集合
    let template = [
        {
            label: 'Home',
            click: () => {
                BrowserWindow.getAllWindows()[0].loadURL(`file:///${app.getAppPath()}/h5/index.html#/overview/index`)
            }
        }
    ]
    //载入模板
    const menu = Menu.buildFromTemplate(template)
    //主进程设置应用菜单
    Menu.setApplicationMenu(menu)
}

module.exports = {
    customMenuHandle
}