const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        autoHideMenuBar: true, 
        backgroundColor: '#0b0e14',
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false 
        }
    });

    win.loadFile('index.html');
    
    win.once('ready-to-show', () => {
        win.show();
        win.maximize();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});