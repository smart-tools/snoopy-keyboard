// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, Menu, Tray } = require("electron");
const path = require("path");

let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 600,
    height: 400,
    autoHideMenuBar: true,
  });
  window.setMenuBarVisibility(false);
  // and load the index.html of the app.
  window.loadFile("client/index.html");

  // This is a global shortcut to activate Geniemoji with hotkey(s)
  globalShortcut.register("Control+q", () => {
    if (window.isVisible()) {
      hideWindow();
    } else {
      showWindow();
    }
  });

  if (process.platform == "darwin") {
    // Don't show the app in the dock for macOS
    app.dock.hide();
  } else {
    // To hide the app in the dock for windows and linux
    window.setSkipTaskbar(true);
  }
  // Open the DevTools.
  // window.webContents.openDevTools()
}

const hideWindow = () => {
  // This is required because app.hide() is not defined in windows and linux
  if (process.platform == "darwin") {
    // This is so that when reopening the window, the previous state is not remembered
    window.reload();
    // Both of these are needed because they help restore focus back to the previous window
    app.hide();
    window.hide();
  } else {
    // This is so that when reopening the window, the previous state is not remembered
    window.reload();
    // Both of these are needed because they help restore focus back to the previous window
    window.minimize();
    window.hide();
  }
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Hide the window when it loses focus
  window.on("blur", () => {
    hideWindow();
  });
});

// Hide the menu and dev tools
Menu.setApplicationMenu(null);

app.on("ready", () => {
  createTray();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

const createTray = () => {
  tray = new Tray("icon.png");
  tray.on("right-click", () => {
    tray.destroy();
    app.quit();
    window.destroy();
  });
  tray.on("double-click", toggleWindow);
  tray.on("click", function (event) {
    toggleWindow();
  });
};

const showWindow = () => {
  window.show();
};

const toggleWindow = () => {
  if (window.isVisible()) {
    hideWindow();
  } else {
    showWindow();
  }
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
