// Modules to control application life and create native browser window
const { app } = require("electron");
const path = require("path");
const { menubar } = require("menubar");

const mb = menubar({
  browserWindow: {
    width: 450,
    height: 660,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    focusable: true,
    fullscreen: false,
    fullscreenable: true,
    hasShadow: true,
    devTools: true,
    autoHideMenuBar: true,
    frame: true
  },
  preloadWindow: true,
  icon: path.join(__dirname, "./MenuIcon.png"),
  webPreferences: {
    partition: "persist:xmmenuplayer",
    webgl: true,
  },
});


mb.app.commandLine.appendSwitch(
  "disable-backgrounding-occluded-windows",
  "true"
);

mb.on("ready", () => {
  console.log("app is ready");

  win = mb.window;
  // win.openDevTools();

  // First URL
  win.loadURL("https://player.siriusxm.com/now-playing");
  win.setBackgroundColor('#333333')
  win.once('ready-to-show', () => {
    win.show()
  });

  // mb.on('after-create-window', () => {}

  // Once dom-ready
  win.webContents.once("dom-ready", () => {
    setInterval(() => {
      // Artist Name
      const artistName = win.webContents
        .executeJavaScript(
          `document.querySelector('.sxm-player-controls .artist-name').innerText`
        )
        .then((result) => result.trim());

      // Track Name
      const trackName = win.webContents
        .executeJavaScript(
          `document.querySelector('.sxm-player-controls .track-name').innerText`
        )
        .then((result) => result.trim());

      // Player State
      const playerState = win.webContents
        .executeJavaScript(
          `document.querySelector('.sxm-player-controls .play-pause-btn').getAttribute('title')`
        )
        .then((result) => result.trim())
        .then((state) => (state == "Play" ? "⏸︎" : ""));

      Promise.all([artistName, trackName, playerState])
        .then(([artistName, trackName, playerState]) => {
          // Set Menubar Title
          mb.tray.setTitle(`${playerState} ${artistName} - ${trackName}`);
        })
        .catch(() => { });
    }, 1000);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
