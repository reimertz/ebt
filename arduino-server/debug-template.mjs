const style = `<style>
  body {
    font-family: 'Monospace', monospace;
    margin: 0;
    padding: 20px;
    background-color: #000;
    color: #fff;
    text-align: center;
  }
  h1 {
    color: #fff;
  }

  #sensorValues {
    display: flex;
    flex-direction: column-reverse;
    margin-top: 20px;
    padding: 10px;
    background-color: #333;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(255,255,255,0.1);
    color: #fff;
  }

  #sensorValues > div {
    opacity: 0.5;
  }

  #sensorValues > div:last-child {
    opacity: 1;
  }

  #sensorValues > div:nth-last-child(2) {
    opacity: 0.8;
  }

  #sensorValues > div:nth-last-child(3) {
    opacity: 0.7;
  }



  .sensor-value {
    margin: 10px 0;
    padding: 10px;
    background-color: #444;
    border-radius: 5px;
    color: #fff;
  }
  button {
    background-color: #555;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Monospace', monospace;
  }
  button:hover {
    background-color: #777;
  }
</style>
`

export const pageHtml = `
    ${style}
    <h1>Sensor Value Editor</h1>
    <div id="sensorValues"></div>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      socket.on('sensorUpdates', function(data) {
        const sensorData = JSON.parse(data);
        document.getElementById('sensorValues').innerHTML += Object.keys(sensorData).map(key =>
          \`<div class="sensor-value">\${key}: \${sensorData[key]}</div>\`).join('');
      });

      function updateSensorValue(sensorName, value) {
        fetch('/update-sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sensorName, value }),
        })
        .then(response => response.text())
        .then(data => {
          console.log(data);
        });
      }
    </script>
  `
