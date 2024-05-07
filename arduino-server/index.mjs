import { createServer } from 'node:http'
import express from 'express'
import SocketIO from 'socket.io'
import Johhny5 from 'johnny-five'

import { pageHtml } from './debug-template.mjs'
import { parseDHTData } from './utils.mjs'

const { Board, Thermometer, Sensor } = Johhny5

const app = express()
const server = createServer(app)
const io = SocketIO(server, {
  llowEIO3: true,
})

let SENSORS = [
  {
    name: 'thermometer_1',

    init: () =>
      new Thermometer({
        controller: 'TMP36',
        pin: 'A0',
        freq: 1000,
      }),
    getValue: (sensor) => sensor.celsius,
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
        freq: 100,
      }),
    getValue: (sensor) => sensor.value,
    emulation: {
      values: { dark: 50, room: 400, sunlit_room: 980, direct_sun: 1015 },
      value: 1000,
    },
  },
  {
    name: 'humiditysensor_1',
    init: function (board) {
      // setup listener

      board.sysexResponse(0x74, (dhtData) => {
        const { humidity } = parseDHTData(dhtData)

        this.value = humidity

        if (this.callback) {
          this.callback(this.value)
        }
      })

      //trigger sensor reading every 1.5 seconds
      setInterval(() => {
        const attachCommand = [
          0x74, // DHTSENSOR_DATA
          0x01, // DHTSENSOR_ATTACH_DHT11 (change to 0x02 for DHT22)
          7, // Pin
          0, // Blocking when reading sensor
          1000, // pooling interval
        ]
        board.sysexCommand(attachCommand)
      }, 1500)

      return this
    },
    on: function (_, callback) {
      this.callback = callback
    },
    getValue: (sensor) => sensor.value,
    emulation: {
      values: {
        very_dry: 10,
        dry: 35,
        regular: 50,
        humid: 75,
        very_humid: 95,
      },
      value: 50,
    },
  },
  {
    name: 'touchsensor_1',
    getValue: (sensor) => sensor.value,
    emulation: {
      values: {
        no_touch: 0,
        touch: 1000,
      },
      value: 0,
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
  console.log('new user')
  if (process.env.EMULATE === 'true') {
    SENSORS.forEach((sensor) => {
      console.log('sensorUpdates', JSON.stringify({ [sensor.name]: sensor.emulation.value }))
      io.emit('sensorUpdates', JSON.stringify({ [sensor.name]: sensor.emulation.value }))
    })
  }
})

io.on('leds', (data) => {
  console.log('123123', data)
})

io.on('sensorUpdates', (data) => {
  console.log('123123', data)
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
      if (!sensor.init) return
      const sensorInstance = sensor.init(board)
      sensorInstance.on('change', () => {
        io.emit('sensorUpdates', JSON.stringify({ [sensor.name]: sensor.getValue(sensorInstance) }))
      })
    })
  })
} else {
  console.log('Board initialization and sensor setup skipped due to emulation mode')
}
