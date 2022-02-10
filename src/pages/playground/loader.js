(() => {
	const { ipcRenderer } = require('electron');

	let mainAppTitle;
	const restoreApp = () => ipcRenderer.send('app:unmaximize');

	const maximizeApp = () => ipcRenderer.send('app:maximize');

	const onRestoreHandler = (isMaximize) => {
		if (isMaximize) {
			restoreBtn.onclick = maximizeApp;
			restoreBtn.classList.remove('unmaximize');
			restoreBtn.classList.add('maximize');
			restoreBtn.setAttribute('title', 'Maximize');
			return;
		}

		restoreBtn.onclick = restoreApp;
		restoreBtn.classList.remove('maximize');
		restoreBtn.classList.add('unmaximize');
		restoreBtn.setAttribute('title', 'Restore');
	}

	const updateAppTitle = val => {
		mainAppTitle = val;
		if (appTitle) appTitle.innerText = val;
	};

	const ready = (_, isMaximized) => {
		updateAppTitle(document.title);
		onRestoreHandler(!isMaximized);
	}

	minimizeBtn.onclick = () => ipcRenderer.send('app:minimize');
	quitBtn.onclick = () => ipcRenderer.send('app:quit');

	ipcRenderer.on('app:ready', ready);
	ipcRenderer.on('app:isMaximize', () => onRestoreHandler(false));
	ipcRenderer.on('app:isUnmaximize', () => onRestoreHandler(true));
})();