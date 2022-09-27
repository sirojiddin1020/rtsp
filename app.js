const express = require('express')
const app = express()
const cors = require('cors')
const Stream = require('node-rtsp-stream')

app.use(cors())

const streams = {}

let stream_configs = [{
  key: 'bunnyvideo',
  port: 9999,
  url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4'
  // url: 'rtsp://rtsp.stream/pattern'
}]

const stopStream = (port) => {
  if (streams[port]) {
    streams[port].stop()
    streams[port] = null
  }
}

const startStream = (name, streamUrl, wsPort) => {
  const stream = new Stream({
    name,
    streamUrl,
    wsPort,
    ffmpegOptions: {
      '-stats': '',
      '-r': 30
    }
  })
  streams[wsPort] = stream
}

app.get('/start-stream', (req, res) => {
  try {
    const { url, port, key = "stream" } = req.query

    if (!url || !port) {
      return res.json({ message: "Bad Request" })
    }
    if (streams[port]) {
      return res.json({ message: "Port in use" })
    }

    startStream(key, url, port)
    
    res.json('Started stream')
  } catch (error) {
    console.log(error);
  }
})

app.get('/stop-stream', (req, res) => {
  const { port } = req.query
  stopStream(port)
  return res.json({ message: "Stopped stream" })
})

app.listen(3000, () => {
  console.log('listening on port 4000');
  stream_configs.forEach((config) => {
    startStream(config.key, config.url, config.port)
  })
})
