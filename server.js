const express = require('express')
const WebSocket = require('ws')

console.log('http://localhost:5000');

const app = express()
const httpServer = require('http').createServer(app)
const server = new WebSocket.Server({server: httpServer})

app.use(express.static('./Client'))
app.use('/', (req, res) => {
    res.send()
})

const users = {}

server.on('connection', socket => {
    socket.send(JSON.stringify({action: 'Login page'}))
    socket.onmessage = message => {
        const parsed = JSON.parse(message.data)
        switch (parsed.action) {
            case 'login':
                users[parsed.value] = socket
                socket.send(JSON.stringify({
                    action: 'Chat page'}))
                break;
            case 'message':
                if(parsed.value.match(/^@\S+/) &&
                   parsed.value.match(/^@\S+/)[0].slice(1, parsed.value.indexOf(' '))) {
                    users[parsed.value.match(/^@\S+/)[0].
                    slice(1, parsed.value.indexOf(' '))].
                    send(JSON.stringify({
                        action: 'Private-message',
                        login: parsed.login, 
                        value: parsed.value.slice(parsed.value.indexOf(' ') + 1)}))
                    socket.send(JSON.stringify({
                        action: 'Private-message',
                        login: parsed.login, 
                        value: parsed.value.slice(parsed.value.indexOf(' ') + 1)}))
                    }
                 else {
                    broadCast({
                        action: 'Message-for-all',
                        login: parsed.login, 
                        value: parsed.value})
                    }
            default:
                break;
        }
    }
})

httpServer.listen(5000)

function broadCast(message) {
    Object.values(users).forEach(user => {
        user.send(JSON.stringify(message))
    })
}