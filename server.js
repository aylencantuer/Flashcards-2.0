// Importación de módulos
const express = require('express'); 
const http = require('http'); 
const WebSocket = require('ws'); 

const app = express(); 
const server = http.createServer(app); 

app.use(express.static("./")); 

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
}); 

const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    const decodedMessage = message.toString();

    try {
      const data = JSON.parse(decodedMessage); // Procesar el mensaje JSON

      if (data.type === 'flashcard') {
        console.log('Nueva tarjeta de Flashcard añadida:', data); 
        ws.send('Tarjeta de Flashcard recibida correctamente');
      } else {
        console.log('Mensaje no relacionado con Flashcard recibido:', data);
        ws.send('Mensaje recibido, pero no relacionado con Flashcard');
      }

    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
      ws.send('Error al procesar el mensaje');
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });
});
