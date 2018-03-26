'use strict';
const electron = require('electron');
const isDev = require('electron-is-dev');
const autoUpdater = require("electron-updater").autoUpdater;
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// Module to control application life.
const app = electron.app;
app.commandLine.appendSwitch('js-flags', '--expose_gc');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1182, height: 749, 'accept-first-mouse': true,'title-bar-style': 'hidden', resizable:false});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/slspatcherui/dist/index.html');

  if(process.argv.includes("-devtools"))
    mainWindow.webContents.openDevTools();

  mainWindow.webContents.executeJavaScript("window.localStorage.setItem('version', '"+app.getVersion()+"');console.log('storing version');")


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.


function sendStatusToWindow(text) {
  log.info(text);
  
  mainWindow.webContents.send('message', text);
}
if(!isDev){
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app-patch'));");
    sendStatusToWindow('Update available.');
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app-patch-progress'), {detail:{progress:"+progressObj.percent+"}});");
    sendStatusToWindow(log_message);
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    app.quit();
  });
}
app.on('ready', function()  {
  createWindow();
  if(!isDev){
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});