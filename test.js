const express = require('express')
const app = express()
const cors = require('cors')
const Stream = require('node-rtsp-stream')

app.use(cors())

const streams = {}



app.get('/start-stream', async (req, res) => {
  try {
    const { url, port, key = "stream" } = req.query

    if (streams[port]) {
      return res.json({ message: "Port in use, try with another port" })
    }
    const stream = await new Stream({
      name: key,
      streamUrl: url,
      wsPort: port,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30
      }
    })
    streams[port] = stream
    res.json({ message: 'start' })

  } catch (error) {
    console.log(error);
  }
})

app.get('/stop-stream', (req, res) => {
  const { port } = req.query
  if (streams[port]) {
    streams[port].stop()
    streams[port] = null
    return res.json({ message: "Stopped stream", hey: streams[port] })
  }
})

app.listen(3000, () => {
  console.log('listening on port 3000');
})
