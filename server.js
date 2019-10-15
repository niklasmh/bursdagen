const util = require('util')
const exec = util.promisify(require('child_process').exec)

let videoes = []
try {
  videoes = require('./videoes/videoes')
} catch (ex) {}

async function playVideo(video) {
  const { stdout } = await exec(
    `ffmpeg -i ${video} 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,//`,
  )
  const [hours, minutes, seconds] = stdout.split(':').map(e => parseFloat(e))
  const time = hours * 3600 + minutes * 60 + seconds
  exec(`timeout ${time}s vlc ${video}`)
}

//playVideo('./videoes/video1.webm')
