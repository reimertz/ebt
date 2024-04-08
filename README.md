# EBT Arduino Server

This project sets up a server to interact with Arduino sensors using Johnny-Five, Express, and Socket.IO. It allows for real-time sensor data visualization and manual sensor value updates through a web interface. Additionally, it integrates with Touch Designer to create dynamic visualizations based on the sensor data received from the Arduino, leveraging Socket.IO for seamless real-time communication between the server and Touch Designer.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. This project requires Node.js version 12.x or higher. You can download it from [nodejs.org](https://nodejs.org/).

- **npm**: Node.js installation will also install npm, which is the package manager used to install project dependencies.

- **Arduino Setup**: Before running this project, you need to set up your Arduino board. Install the StandardFirmataPlus firmware on your Arduino board using the Arduino IDE. This firmware is an extension of StandardFirmata and includes support for additional sensors and actuators, allowing Johnny-Five to communicate with a wider range of Arduino components.

### Installation

1. **Clone the Repository**: First, clone this repository to your local machine using `git clone`.

2. **Install Dependencies**: Navigate to the project directory (`EBT/arduino-server`) and run `npm install` to install the required dependencies, including Johnny-Five and its dependencies such as StandardFirmataPlus.

3. **Configure Arduino**: Connect your Arduino board to your computer. Ensure that the StandardFirmataPlus firmware is uploaded to your board.

### Running the Server

- **Normal Mode**: To start the server in normal mode, where it communicates with the actual Arduino hardware, run `npm start` or `node index.mjs`.

- **Emulation Mode**: If you don't have an Arduino board connected or want to test the server without the hardware, you can start the server in emulation mode. Set the environment variable `EMULATE` to `true` and then start the server. For example, on Unix-based systems, you can run:

  ```
  EMULATE=true npm start
  ```

  On Windows, you can use:

  ```
  set EMULATE=true
  npm start
  ```

  This will use predefined sensor values for testing purposes.

### Interacting with the Server and Touch Designer

Once the server is running, you can access the sensor value editor web interface by navigating to `http://localhost:3000` in your web browser. Here, you can view real-time sensor data and manually update sensor values if in emulation mode. The server uses Socket.IO to emit sensor data events, which can be received by Touch Designer in real-time. This allows for the creation of dynamic visualizations in Touch Designer that respond to changes in sensor data, providing a powerful tool for interactive installations and performances.

## Dependencies

- **Johnny-Five**: A JavaScript Robotics & IoT Platform that provides a uniform API for accessing a variety of microcontroller and IoT devices, including Arduino.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Socket.IO**: Enables real-time, bidirectional, and event-based communication between web clients and servers, and is crucial for the integration with Touch Designer.

## Node Version

This project requires Node.js version 18.x or higher.

