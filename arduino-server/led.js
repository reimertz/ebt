// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.
const { io } = require('socket.io-client')
const five = require('johnny-five')
const pixel = require('node-pixel')

const opts = {}
opts.port = process.argv[2] || '/dev/tty.usbmodem11401'

const board = new five.Board(opts)
let strip = null

const fps = 10 // how many frames per second do you want to try?

// const socket = io('ws://localhost:3000')

// // client-side
// socket.on('connect', () => {
//   console.log('connected to websocket server')
// })

// socket.on('rgb', (data) => {
//   console.log('got rgb led values')
//   cobsole.log(data)
// })

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

    const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white']
    // var current_colors = [0,1,2,3,4];
    const current_pos = [0, 1, 2, 3, 4]

    current_pos.forEach((pos) => {
      strip.pixel(pos).color(colors[pos])
    })

    const blinker = setInterval(function () {
      strip.shift(1, pixel.FORWARD, true)

      strip.show()
    }, 1000 / fps)
  })
})

// var five = require('johnny-five')
// var pixel = require('node-pixel')

// var opts = {}
// opts.port = process.argv[2] || '/dev/tty.usbmodem11101'

// var board = new five.Board(opts)
// var strip = null

// /**1    qq1
//  * how many frames per second do you want to try?
//  */
// var fps = 20

// board.on('ready', function () {
//   console.log('Board ready, lets add light')

//   // setup the node-pixel strip.
//   strip = new pixel.Strip({
//     data: 6,
//     length: 150, // led
//     board: this,
//     controller: 'FIRMATA',
//   })

//   strip.on('ready', function () {
//     console.log("Strip ready, let's go")
//     dynamicRainbow(fps)
//   })

//   function dynamicRainbow(delay) {
//     console.log('dynamicRainbow')

//     var showColor
//     var cwi = 0 // colour wheel index (current position on colour wheel)
//     var foo = setInterval(function () {
//       if (++cwi > 255) {
//         cwi = 0
//       }

//       for (var i = 0; i < strip.length; i++) {
//         showColor = colorWheel((cwi + i) & 255)
//         strip.pixel(i).color(showColor)
//       }
//       strip.show()
//     }, 1000 / delay)
//   }

//   // Input a value 0 to 255 to get a color value.
//   // The colors are a transition r - g - b - back to r.
//   function colorWheel(WheelPos) {
//     var r, g, b
//     WheelPos = 255 - WheelPos

//     if (WheelPos < 85) {
//       r = 255 - WheelPos * 3
//       g = 0
//       b = WheelPos * 3
//     } else if (WheelPos < 170) {
//       WheelPos -= 85
//       r = 0
//       g = WheelPos * 3
//       b = 255 - WheelPos * 3
//     } else {
//       WheelPos -= 170
//       r = WheelPos * 3
//       g = 255 - WheelPos * 3
//       b = 0
//     }
//     // returns a string with the rgb value to be used as the parameter
//     return 'rgb(' + Math.min(r, 10) + ',' + Math.min(g, 10) + ',' + Math.min(b, 10) + ')'
//   }
// })
