# EBT Arduino Server

This project establishes a server to interface with Arduino sensors through Johnny-Five, Express, and Socket.IO, facilitating real-time sensor data visualization and manual sensor value adjustments via a web interface. It also integrates with Touch Designer for dynamic visualizations based on Arduino sensor data, utilizing Socket.IO for instant communication between the server and Touch Designer.

## Getting Started

### Prerequisites

- **Node.js**: Node.js version 18.x or higher is required. Download it from [nodejs.org](https://nodejs.org/).

- **npm**: Comes with Node.js and is used for installing dependencies.

- **Arduino Setup**: Install StandardFirmataPlus firmware on your Arduino board with the Arduino IDE to allow Johnny-Five to interact with a broader range of components.

### Installation

1. **Clone the Repository**: Use `git clone` to clone this repository to your machine.

2. **Install Dependencies**: In the project directory (`EBT/arduino-server`), run `npm install` to install Johnny-Five and other dependencies.

3. **Configure Arduino**: Connect your Arduino board to your computer and upload the StandardFirmataPlus firmware.

### Running the Server

#### With Arduino Connected

To operate the server with actual Arduino hardware, ensuring real sensor data interaction, execute:

```
npm start
```

This "Normal Mode" requires the Arduino board to be connected and properly configured as described in the installation steps.


#### Emulation Mode

For situations where an Arduino board is not available or for testing purposes without hardware, the server can be run in "Emulation Mode". This mode simulates sensor values, allowing the server to function without a physical Arduino connection. Activate this mode by setting the `EMULATE` environment variable to `true` before starting the server:

```
npm run emulation
```

### Interacting with the Server and Touch Designer

With the server operational, access the sensor value editor web interface at `http://localhost:3000`. This interface displays real-time sensor data and allows manual updates in Emulation Mode. Sensor data events are emitted using Socket.IO, facilitating real-time data visualization in Touch Designer for interactive installations and performances.

## Dependencies

- **Johnny-Five**: A JavaScript Robotics & IoT Platform for various microcontroller and IoT devices, including Arduino.
- **Express**: A Node.js web application framework for building web and mobile applications.
- **Socket.IO**: Supports real-time, bidirectional, and event-based communication between web clients and servers. Essential for Touch Designer integration.

## Node Version

Node.js version 18.x or higher is required for this project.
