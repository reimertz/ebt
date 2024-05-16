// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.
const io = require('socket.io-client')
const five = require('johnny-five')
const pixel = require('node-pixel')

const opts = {}
opts.port = process.argv[2] || '/dev/tty.usbmodem141201' // extension cable + adapter

const board = new five.Board(opts)
let strip = null

const fps = 2.1667 // how many frames per second do you want to try?

const socket = io('ws://localhost:3000')

// client-side
socket.on('connect', () => {
  console.log('connected to websocket server')
})

let current_color = 'red'

let sensors = {
  humiditysensor_1: 0,
  photoresistor_1: 0,
  touchsensor_1: 0,
}

socket.on('leds', (data) => {
  console.log('got leds values')
})

socket.on('sensorUpdates', (json) => {
  const data = JSON.parse(json)
  //console.log('got sensorUpdates values')

  sensors = {
    ...sensors,
    ...data,
  }

  if (sensors.touchsensor_1 >= 1000) {
    current_color = 'green'
  } else if (sensors.humiditysensor_1 > 75) {
    current_color = 'blue'
  } else if (sensors.humiditysensor_1 > 50) {
    current_color = 'cyan'
  } else if (sensors.photoresistor_1 > 950) {
    current_color = 'yellow'
  } else if (sensors.photoresistor_1 > 500) {
    current_color = 'orange'
  } else {
    current_color = 'red'
  }
})

board.on('ready', function () {
  console.log('Board ready, lets add light')

  strip = new pixel.Strip({
    data: 6,
    length: 150,
    color_order: pixel.COLOR_ORDER.GRB,
    board: this,
    controller: 'FIRMATA',
  })

  strip.on('ready', function () {
    console.log("Strip ready, let's go")

    strip.color('#000000')
    strip.show()

    const steps = 1

    let fade_level = 5
    let fade_up = true

    const fader = setInterval(function () {
      if (fade_up) {
        // fading upwards, if we hit the top then turn around
        // and go back down again.

        fade_level = 25
        fade_up = false
      } else {
        fade_level = 5
        fade_up = true
      }

      let hc = ''

      switch (current_color) {
        case 'red':
          hc = `rgb(${fade_level}, 0, 0)`
          break
        case 'green':
          hc = `rgb(0, ${fade_level}, 0)`
          break
        case 'blue':
          hc = `rgb(0, 0, ${fade_level})`
          break
        case 'orange':
          hc = `rgb(${fade_level}, ${Math.floor(fade_level / 2)}, 0)`
          break
        case 'white':
          hc = `rgb(${fade_level}, ${fade_level}, ${fade_level})`
          break
        case 'yellow':
          hc = `rgb(${fade_level}, ${fade_level}, 0)`
          break
        case 'magenta':
          hc = `rgb(${fade_level}, 0, ${fade_level})`
          break
        case 'cyan':
          hc = `rgb(0, ${fade_level}, ${fade_level})`
          break
        default:
          break
      }
      // need to do this by pixel
      for (let i = 0; i < strip.length; i++) {
        strip.pixel(i).color(hc)
      }
      // strip.color(hc);
      strip.show()
    }, 1000 / fps)
  })
})
