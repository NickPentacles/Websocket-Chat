const socket = new WebSocket('ws://localhost:5000')
const page = document.getElementById('page')

let login
let message
let chat

socket.onmessage = message => {
    const parsed = JSON.parse(message.data)
    console.log(parsed.value);
    switch (parsed.action) {
        case 'Login page':
            page.innerHTML = `
                <div class="login-screen" id="login-screen">
                    <center><h1>Enter your login</h1></center>
                    <input type="text" class="login-input" id="login-input">
                    <button type="button" class="login-send" id="login-send">OK</button>
                </div>`
            const input = document.getElementById('login-input')
            const button = document.getElementById('login-send')
            button.onclick = () => {
                if(input.value) {
                    login = input.value
                    socket.send(JSON.stringify({
                        action: 'login',
                        value: login}))
                }
            }
            break;
        case 'Chat page':
            page.innerHTML = `        
                <div class="chat-room" id="chat-room">
                    <div class="user-login" id="user-login"></div>
                    <div class="chat-field" id="chat-field"></div>
                    <input class="user-message" id="user-message"/>
                </div>`
            document.getElementById('user-login').innerText = login
            message = document.getElementById('user-message')
            message.onkeydown = event => {
                if(message.value && event.key == 'Enter') {
                    socket.send(JSON.stringify({
                        action: 'message',
                        login: login,
                        value: message.value
                    }))
                message.value = ""
                }
            }
            break;
        case 'Message-for-all':
            chat = document.getElementById('chat-field')
            chat.innerHTML += `                
                <span class="message-for-all">
                    <span class="from">${parsed.login}:</span>
                    <span class="message">${parsed.value}</span>  
                </span>`
            break;
        case 'Private-message':
            chat = document.getElementById('chat-field')
            chat.innerHTML += `                
                <span class="message-private">
                    <span class="from">${parsed.login}:</span>
                    <span class="message">${parsed.value}</span>  
                </span>`
            break;
        default:
            break;
    }
}

