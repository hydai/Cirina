const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	selectDirectory: () => ipcRenderer.invoke('select-directory'),
	performBackup: (installPath, backupPath) => ipcRenderer.invoke('perform-backup', installPath, backupPath),
	performInstall: (dataPath, installPath) => ipcRenderer.invoke('perform-install', dataPath, installPath),
	performRestore: (backupPath, installPath) => ipcRenderer.invoke('perform-restore', backupPath, installPath)
});
