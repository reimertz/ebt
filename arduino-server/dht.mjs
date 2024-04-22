import { createServer } from 'node:http'
import express from 'express'
import SocketIO from 'socket.io'
import Johhny5 from 'johnny-five'

import { pageHtml } from './debug-template.mjs'

const { Board, Boards } = Johhny5

const board = new Board({ debug: true })

board.on('ready', function () {
  console.log('Board ready!')

  board.queryCapabilities(console.log)

  board.sysexResponse(0x6c, function (data) {
    console.log('Capability Response received:')
    let pin = 0
    let i = 2 // Start at index 2 to skip header (0xF0, 0x6C)
    while (i < data.length) {
      if (data[i] === 0x7f) {
        console.log(`Pin ${pin} capabilities end.`)
        pin++
        i++
        continue
      }
      const mode = data[i]
      const resolution = data[i + 1]
      console.log(`Pin ${pin} - Mode: ${mode}, Resolution: ${resolution}`)
      i += 2
    }
  })

  // Send Capability Query (0xF0, 0x6B, 0xF7)

  setInterval(function () {
    board.sysexCommand([0xf0, 0x6b, 0xf7])
  }, 500)

  // Listen for the Capability Response (0x6C)
})

board.on('error', function (error) {
  console.log('Error:', error)
})
