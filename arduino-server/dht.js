const Firmata = require('firmata')
const Board = Firmata.Board
const SerialPort = require('serialport')

// Connect to the serial port where your microcontroller is connected
const port = new SerialPort('/dev/tty.usbmodem2101', { baudRate: 57600 })
const board = new Board(port)

board.on('ready', function () {
  console.log('Board ready!')

  // Attach the DHT11 sensor on pin 7

  board.sysexResponse(0x74, function (data) {
    console.log(data)
  })

  const pin = 7
  const attachCommand = [
    0x74, // DHTSENSOR_DATA
    0x01, // DHTSENSOR_ATTACH_DHT11 (change to 0x02 for DHT22)
    pin,
    0,
    2000,
  ]

  // Listen for sensor data
  setInterval(() => {
    // // Send the attach command
    //board.sysexCommand(attachCommand)
  }, 1000)
  board.sysexCommand(attachCommand)
  // To detach the sensor
  // const detachCommand = [0xF0, 0x74, 0x03, pin, 0xF7];
  // board.sysexCommand(detachCommand);
})

board.on('error', function (error) {
  console.log(error)
})
