const fs = require('fs')
const dotenv = require('dotenv')
require('dotenv').config()
try {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
} catch (ex) {}

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const IS_CLOUD = process.argv[2] === 'cloud'
const IS_LOCAL = !IS_CLOUD

const getPort = url => {
  if (/:/.test(url.slice(8))) {
    try {
      return parseInt(
        url
          .slice(8)
          .split(/\//)[0]
          .split(/:/)[1],
      )
    } catch (e) {
      return 80
    }
  }
  return 80
}

if (IS_CLOUD) {
  process.env['PORT'] = getPort(process.env.CLOUD)
} else {
  process.env['PORT'] = getPort(process.env.LOCAL)
}

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let videoes = []
try {
  videoes = require('./videoes/videoes')
} catch (ex) {}

async function playVideo(video, ws = null, beforePlay = time => {}) {
  let timeContent = ''
  try {
    const { stdout, stderr } = await exec(`ffmpeg -i ./videoes/${video}`)
    timeContent = stdout + stderr
  } catch (e) {
    timeContent = JSON.stringify(e)
  }
  const start = timeContent.split(/\d\d:\d\d:\d\d.\d\d/)[0].length
  const [hours, minutes, seconds] = timeContent
    .slice(start, start + 11)
    .split(':')
    .map(e => parseFloat(e))
  const time = hours * 3600 + minutes * 60 + seconds
  beforePlay(time)
  try {
    if (~process.platform.indexOf('win')) {
      await exec(`vlc ./videoes/${video} --fullscreen --play-and-exit`)
    } else {
      await exec(`timeout ${time}s vlc ./videoes/${video} --fullscreen`)
    }
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
    const broadcastRegex = /^broadcast\:/
    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, '')
      if (IS_CLOUD) {
        wss.clients.forEach(client => {
          sendMessage(client, 'play', {
            file: message,
          })
        })
      }
    } else {
      if (IS_LOCAL) {
        console.log('playing video: ' + message)
        playVideo(message, ws, time => {
          sendMessage(ws, 'play', {
            file: message,
            time,
          })
        })
      }
    }
  })

  sendMessage(ws, 'init', {
    videoes,
  })
})

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Running ${IS_CLOUD ? 'in the cloud' : 'locally'} on http://localhost:${
      server.address().port
    }`,
  )
})
