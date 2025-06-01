const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const WebSocket = require('ws');


const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const chatRoutes = require('./routes/chatRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const wss = new WebSocket.Server({ server });

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('./uploads', express.static('uploads'));


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.send('Hello from server!');

    ws.on('message', (msg) => {
        console.log('Received:', msg);
        ws.send(`Server echo: ${msg}`);
    });

    ws.on('close', () => console.log('Client disconnected'));
});

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);
  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });
});




app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recruiters', recruiterRoutes);
server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
