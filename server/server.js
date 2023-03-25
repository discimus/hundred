import WebSocket, { WebSocketServer } from "ws"
import randomWords from "random-words"

const wssConfig = {
    port: process.env.PORT || 8181
}

const wss = new WebSocketServer(wssConfig)

const payloadOf = {
    TEXT_MESSAGE: 0,
    ONLINE_USERS_COUNT: 1,
    NEW_USER_NOTIFICATION: 2,
}

function handleConnection(ws) {

    const handle = {
        message(rawMessage) {
            const now = new Date(Date.now())
            const message = `<span class="text-slate-300">At ${now.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })} <b>${ws.id}</b> says:</span></br>${String(rawMessage)}`
    
            if (message != "") {
                var payload = {
                    type: payloadOf.TEXT_MESSAGE,
                    payload: message
                }
    
                wss.clients.forEach(t => t.send(JSON.stringify(payload)))
                console.log(message);
            }
        },
        close() {
            var payload = {
                type: payloadOf.ONLINE_USERS_COUNT,
                payload: wss.clients.size
            }
        
            wss.clients.forEach(t => t.send(JSON.stringify(payload)))

            var payload = {
                type: payloadOf.TEXT_MESSAGE,
                payload: `<span class="text-sky-500"><b>${id}</b> left the chat</span>`
            }

            wss.clients.forEach(t => t.send(JSON.stringify(payload)))
        }
    }

    ws.on("message", handle.message)
    ws.on("close", handle.close)

    const id = randomWords(1)

    var payload = {
        type: payloadOf.TEXT_MESSAGE,
        payload: `<span class="text-sky-500">You are ON! Your ID on chat is <b>${id}</b></span>`
    }

    ws.send(JSON.stringify(payload))

    var payload = {
        type: payloadOf.ONLINE_USERS_COUNT,
        payload: wss.clients.size
    }

    wss.clients.forEach(t => t.send(JSON.stringify(payload)))

    ws.id = id

    var payload = {
        type: payloadOf.TEXT_MESSAGE,
        payload: `<span class="text-sky-500"><b>${id}</b> joined the chat</span>`
    }

    wss.clients.forEach(t => t.send(JSON.stringify(payload)))
}

wss.on("connection", handleConnection)