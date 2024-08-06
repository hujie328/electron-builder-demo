const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronFns', {
  onServeSucceed: (callback) => {
    ipcRenderer.on('serve-succeed', (event, msg) => {
      callback(msg)
    })
  }
})
