import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
const fs = require('fs').promises;

// 0a0000 -> 文字
// 000000 -> 字型
const FILES = [
	'0a0000.win32.dat0',
	'0a0000.win32.index',
	'0a0000.win32.index2',
	'000000.win32.dat0',
	'000000.win32.index',
	'000000.win32.index2'
];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			devTools: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// IPC 處理：選擇資料夾
ipcMain.handle('select-directory', async () => {
	const result = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	if (!result.canceled && result.filePaths.length > 0) {
		return result.filePaths[0];
	} else {
		return null;
	}
});

// 複製檔案的輔助函式
async function copyFiles(srcDir, destDir) {
	for (const fileName of FILES) {
		const srcFile = path.join(srcDir, fileName);
		const destFile = path.join(destDir, fileName);
		try {
			// 確認來源檔案是否存在
			await fs.access(srcFile);
			// 複製檔案（預設會覆蓋已存在的檔案）
			await fs.copyFile(srcFile, destFile);
		} catch (err) {
			console.error(`複製檔案失敗 ${srcFile} 到 ${destFile}：`, err);
			throw new Error(`複製 ${fileName} 時發生錯誤：${err.message}`);
		}
	}
}

// IPC 處理：備份（從安裝路徑複製到備份路徑）
ipcMain.handle('perform-backup', async (event, installPath, backupPath) => {
	try {
		await copyFiles(installPath, backupPath);
		return { success: true, message: '備份完成' };
	} catch (error) {
		return { success: false, message: error.message };
	}
});

// IPC 處理：安裝（從資料路徑複製到安裝路徑）
ipcMain.handle('perform-install', async (event, dataPath, installPath) => {
	try {
		await copyFiles(dataPath, installPath);
		return { success: true, message: '安裝完成' };
	} catch (error) {
		return { success: false, message: error.message };
	}
});

// IPC 處理：還原（從備份路徑複製到安裝路徑）
ipcMain.handle('perform-restore', async (event, backupPath, installPath) => {
	try {
		await copyFiles(backupPath, installPath);
		return { success: true, message: '還原完成' };
	} catch (error) {
		return { success: false, message: error.message };
	}
});
