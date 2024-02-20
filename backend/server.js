const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const fetch = require('cross-fetch')
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = socketIO(server)
const users = [{}];
const parser = require('node-html-parser');

(async () => {
  try {
    const res = await fetch('https://mkwrs.com/mk8/display.php?track=Mario+Kart+Stadium')
    const html = await res.text()
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
    const table = parser.parse(html).querySelectorAll('table')
    for (var row of table[2].querySelectorAll('tr')) {
      const row_data = []
      for (var cell of row.textContent.match('\n')['input'].split('\n')) {
        cell_data = String(cell).trim()
        if (cell_data.length > 0) {
          row_data.push(cell_data)
        }
      }
      console.log(row_data)
      console.log("Date: " + row_data[0])
    }
  } catch (err) {
    console.error(err);
  }
})()

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
  res.send("")
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined `);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: ` ${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the convos, ${users[socket.id]} `,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]}  has left`,
    });
    console.log(`user left`);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(socket.id);
  });
});

let home_path = app.settings['views'].substring(0, 5)
server.listen(
    home_path === "/User" || home_path === "C:\\Us"
        ? 4000
        : 5000,
    () => console.log(`Working...`)
);
