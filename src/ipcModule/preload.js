const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronFns', {
  getServeAddress: (callback) => {
    ipcRenderer.invoke('get-serve-address').then(res => {
      callback(res)
    })
  },
  isRunInElectron: () => {
    return true
  },
  electronWinLoad: (params) => {
    console.log('electronWinLoad', params);
    ipcRenderer.send('electron-win-load', params)
  },
  getDataCenterAccessToken: (callback) => {
    ipcRenderer.invoke('get-data_center_access_token').then(res => {
      callback(res)
    })
  },
  cleanElectronCookies: () => {
    ipcRenderer.send('clean-cookies')
  }

})
