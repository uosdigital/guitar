const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Listen for messages from main process
  onNewJam: (callback) => ipcRenderer.on('new-jam', callback),
  onSaveJam: (callback) => ipcRenderer.on('save-jam', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // App version
  appVersion: process.env.npm_package_version || '1.0.0'
});



