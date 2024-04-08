import { createServer } from 'node:http'
import express from 'express'
import SocketIO from 'socket.io'
import Johhny5 from 'johnny-five'

import { pageHtml } from './debug-template.mjs'

const { Board, Thermometer, Sensor } = Johhny5

const app = express()
const server = createServer(app)
const io = SocketIO(server)

const FREQ = 500

let SENSORS = [
  {
    name: 'thermometer_1',

    init: () =>
      new Thermometer({
        controller: 'TMP36',
        pin: 'A0',
        freq: FREQ,
      }),
    emulation: {
      values: { cold: 10, room: 20, touch: 36, warm: 50 },
      value: 20,
    },
  },
  {
    name: 'photoresistor_1',
    init: () =>
      new Sensor({
        pin: 'A1',
        freq: FREQ,
      }),
    emulation: {
      values: { dark: 50, room: 400, sunlit_room: 980, direct_sun: 1015 },
      value: 400,
    },
  },
]

app.use(express.json()) // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  let page = ''
  SENSORS.forEach((sensor) => {
    page += `<h2>${sensor.name}</h2>`
    Object.entries(sensor.emulation.values).forEach(([key, value]) => {
      page += `<button onclick="updateSensorValue('${sensor.name}', '${value}')">${key}</button>`
    })
  })

  res.send(page + pageHtml)
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})

io.on('connection', (socket) => {
  console.log('a user connected; ')

  if (process.env.EMULATE === 'true') {
    SENSORS.forEach((sensor) => {
      console.log('sensorUpdates', JSON.stringify({ [sensor.name]: sensor.emulation.value }))
      io.emit('sensorUpdates', JSON.stringify({ [sensor.name]: sensor.emulation.value }))
    })
  }
})

// Endpoint to update sensor values manually
app.post('/update-sensor', (req, res) => {
  const { sensorName, value } = req.body
  const sensor = SENSORS.find((s) => s.name === sensorName)

  if (sensor) {
    sensor.emulation.value = value

    console.log(SENSORS)
    io.emit(
      'sensorUpdates',
      JSON.stringify({
        [sensorName]: sensor.emulation.value,
      }),
    )
    res.status(200).send(`Sensor ${sensorName} updated with value ${value}`)
  } else {
    res.status(404).send('Sensor not found')
  }
})

if (process.env.EMULATE !== 'true') {
  const board = new Board()

  board.on('ready', () => {
    SENSORS.forEach((sensor) => {
      const sensorInstance = sensor.init()
      sensorInstance.on('change', () => {
        const data = {}
        data[`${sensor.name}`] = sensorInstance.value
        io.emit('sensorUpdates', JSON.stringify(data))
      })
    })
  })
} else {
  console.log('Board initialization and sensor setup skipped due to emulation mode')
}
