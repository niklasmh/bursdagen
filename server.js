const util = require('util')
const exec = util.promisify(require('child_process').exec)
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let videoes = []
try {
  videoes = require('./videoes/videoes')
} catch (ex) {}

async function playVideo(video, ws = null) {
  const { stdout } = await exec(
    `ffmpeg -i ./videoes/${video} 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,//`,
  )
  const [hours, minutes, seconds] = stdout.split(':').map(e => parseFloat(e))
  const time = hours * 3600 + minutes * 60 + seconds
  try {
    await exec(`timeout ${time}s vlc ./videoes/${video} --fullscreen`)
  } catch (e) {}

  sendMessage(ws, 'done', {
    file: video,
  })
}

function sendMessage(ws, status, data = {}) {
  if (ws) {
    ws.send(
      JSON.stringify({
        status,
        ...data,
      }),
    )
  }
}

wss.on('connection', ws => {
  ws.on('message', message => {
    playVideo(message, ws)
    sendMessage(ws, 'play', {
      file: message,
    })
  })

  sendMessage(ws, 'init', {
    videoes,
  })
})

server.listen(process.env.PORT || 8999, () => {
  console.log(`Running on http://localhost:${server.address().port}`)
})
