
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8000;
let userNameMsg = [];

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("System \"userName\" is connected");
  socket.on("disconnect", (reason) => {
    console.log(`System \"userName\" is disconnect`);
  });
  socket.on('send_msg', data =>{
    userNameMsg.push ([data.name, data.msg]);
    io.emit('new_msg', {name: data.name, msg: data.msg});    
  })
});

app.post('/send_msg', (req, res) => {
  if (req.body.msg) {
    userNameMsg.push([req.body.name, req.body.msg]);
    io.emit('new_msg', { name: req.body.name, msg: req.body.msg });
  }

 if (req.body.id = 'save') {
    const data = userNameMsg.map(item => item.join(': ')).join('\n');
    fs.writeFile('message.txt', data, (err) => {
      if (err) {
        console.error(err);
        res.send('Error');
      } else {
        console.log('The file saved!');
        res.send('The file saved!');
      }
    });
  }
});

