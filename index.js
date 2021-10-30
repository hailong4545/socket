const express = require('express')
const app = express();

app.use(require('cors')())

const server = require("http").createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/socket.html');
    return;
})

users = []
id = []

io.on('connection', (socket) => {
    socket.on('new person', (data) => {
        id.push(socket.id);
        socket.join(socket.id);
        users.push(data);
        io.emit('render', (users));
    });

    socket.on('send-request', (data) => {
        for(let i = 0; i < users.length; i++) {
            if (users[i] == data.name) {
                console.log(id);
                console.log(users);
                io.to(id[i]).emit('recive-request', data);
                break;
            }
        }
    })
})

server.listen(3000);
