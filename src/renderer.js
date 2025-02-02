import './index.css';

window.addEventListener('DOMContentLoaded', () => {
	const installPathInput = document.getElementById('installPath');
	const backupPathInput = document.getElementById('backupPath');
	const dataPathInput = document.getElementById('dataPath');
	const messageDiv = document.getElementById('message');

	// 選擇安裝路徑
	document.getElementById('selectInstall').addEventListener('click', async () => {
		const path = await window.electronAPI.selectDirectory();
		if (path) {
			installPathInput.value = path;
		}
	});

	// 選擇備份路徑
	document.getElementById('selectBackup').addEventListener('click', async () => {
		const path = await window.electronAPI.selectDirectory();
		if (path) {
			backupPathInput.value = path;
		}
	});

	// 選擇資料路徑
	document.getElementById('selectData').addEventListener('click', async () => {
		const path = await window.electronAPI.selectDirectory();
		if (path) {
			dataPathInput.value = path;
		}
	});

	// 備份：從安裝路徑複製檔案到備份路徑
	document.getElementById('backupBtn').addEventListener('click', async () => {
		const installPath = installPathInput.value;
		const backupPath = backupPathInput.value;
		if (!installPath || !backupPath) {
			messageDiv.textContent = '請先選擇安裝路徑和備份路徑';
			return;
		}
		messageDiv.textContent = '備份進行中...';
		const result = await window.electronAPI.performBackup(installPath, backupPath);
		messageDiv.textContent = result.message;
	});

	// 安裝：從資料路徑複製檔案到安裝路徑
	document.getElementById('installBtn').addEventListener('click', async () => {
		const dataPath = dataPathInput.value;
		const installPath = installPathInput.value;
		if (!dataPath || !installPath) {
			messageDiv.textContent = '請先選擇資料路徑和安裝路徑';
			return;
		}
		messageDiv.textContent = '安裝進行中...';
		const result = await window.electronAPI.performInstall(dataPath, installPath);
		messageDiv.textContent = result.message;
	});

	// 還原：從備份路徑複製檔案到安裝路徑
	document.getElementById('restoreBtn').addEventListener('click', async () => {
		const backupPath = backupPathInput.value;
		const installPath = installPathInput.value;
		if (!backupPath || !installPath) {
			messageDiv.textContent = '請先選擇備份路徑和安裝路徑';
			return;
		}
		messageDiv.textContent = '還原進行中...';
		const result = await window.electronAPI.performRestore(backupPath, installPath);
		messageDiv.textContent = result.message;
	});
});

