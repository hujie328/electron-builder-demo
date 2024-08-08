
const {  globalShortcut } = require('electron')
const registerGlobalShortcut = (win) => {
    globalShortcut.register('Alt+F12', () => {
        win.webContents.openDevTools()
    })
}

module.exports = {
    registerGlobalShortcut
}