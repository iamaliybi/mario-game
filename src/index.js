'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
	app.quit();
}

/* Vars */
let window;

/* Funcs */
const createMainWindow = () => {
	if (window instanceof BrowserWindow) {
		window.focus();
		return;
	}

	window = new BrowserWindow({
		minWidth: 768,
		minHeight: 576,
		center: true,
		resizable: true,
		autoHideMenuBar: true,
		frame: false,
		backgroundColor: 'rgb(44, 49, 60)',
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js'),
		}
	});

	window
		.on('ready-to-show', () => window.webContents.send('app:ready', window.isMaximized()))
		.on('maximize', () => window.webContents.send('app:isMaximize'))
		.on('unmaximize', () => window.webContents.send('app:isUnmaximize'))
		.on('ready-to-show', () => window.webContents.send('game:ready', window.getSize()));
};

const init = () => {
	createMainWindow();

	// Load Homepage
	window.maximize();
	window.loadFile(path.join(__dirname, '/pages/playground/index.html'));

	// Focus
	window.focus();
};

const maximizeApp = () => {
	if (!window.isMaximized()) window.maximize();
	window.focus();
};

const quitApp = () => {
	if (process.platform !== 'darwin') app.quit();
};

const unmaximizeApp = () => {
	if (window.isMaximized()) window.unmaximize();
	window.focus();
};

const minimizeApp = () => {
	if (!window.isMinimized()) window.minimize();
};

ipcMain.on('app:unmaximize', unmaximizeApp);
ipcMain.on('app:maximize', maximizeApp);
ipcMain.on('app:quit', quitApp);
ipcMain.on('app:minimize', minimizeApp);

app
	.on('ready', init)
	.on('window-all-closed', quitApp);