# Sensor Server

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

If everything works correctly, you should see sensor values updating in Touch Designer.


#### Emulation Mode

![Demo of EBT Arduino Server](/arduino-server/demo.png)

For situations where an Arduino board is not available or for testing purposes without hardware, the server can be run in "Emulation Mode". This mode simulates sensor values, allowing the server to function without a physical Arduino connection. To run the Emulation mode, run:

```
npm run emulation
```


With emulation enabled, access the sensor value editor web interface at `http://localhost:3000`.

### Arduino Server and Touch Designer

 Sensor data events are emitted using Socket.IO, facilitating real-time data visualization in Touch Designer for interactive installations and performances.

## Dependencies

- **Johnny-Five**: A JavaScript Robotics & IoT Platform for various microcontroller and IoT devices, including Arduino.
- **Express**: A Node.js web application framework for building web and mobile applications.
- **Socket.IO**: Supports real-time, bidirectional, and event-based communication between web clients and servers. Essential for Touch Designer integration.


# Touch Designer

To visualize the sensor data in Touch Designer, you need to open the `touch-designer/EBT.TouchDesigner.toe` file. Ensure you are using Touch Designer release 2023.11510 or newer for full compatibility.

1. Launch Touch Designer.
2. Navigate to `File` > `Open...` or press `Ctrl+O` (Windows) / `Cmd+O` (Mac).
3. Browse to the location of the `EBT.TouchDesigner.toe` file within your project directory.
4. Select the file and click `Open`.

Once opened, the project will automatically start receiving and visualizing data from the Arduino server, provided it is running and configured correctly as per the previous steps.

