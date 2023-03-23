import WebSocket, { WebSocketServer } from "ws"
import randomWords from "random-words"

const wssConfig = {
    port: 8181
}

const wss = new WebSocketServer(wssConfig)

function handleConnection(ws) {

    function handleMessage(rawMessage) {
        const now = new Date(Date.now())
        const message = `[${now.toLocaleTimeString()}] [${ws.id}] ${String(rawMessage)}`

        if (message != "") {
            wss.clients.forEach(t => t.send(message))
            console.log(message);
        }
    }

    ws.on("message", handleMessage)

    const id = randomWords(1)

    ws.send(`You are ON! Your ID on chat is [${id}]`)

    ws.id = id
}

wss.on("connection", handleConnection)