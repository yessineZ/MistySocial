import express from 'express';
import authRoute from './routes/authRoute.routes.js';
import userRoute from './routes/userRoute.routes.js';
import postRoute from './routes/postRoute.routes.js';
import notificationsRoute from './routes/notifications.routes.js';
import messagesRoute from './routes/messages.routes.js';

import env from 'dotenv';
import { connectToMongo } from './connectToDb/connectToMongo.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { app, server, io } from './socket/socket.js';

const __dirname = path.resolve();
env.config({
  path: './.env',
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json({ limit: '10mb' }));

// CORS configuration
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000', 
}));


app.use(cookieParser());


server.listen(process.env.PORT, () => {
  connectToMongo();
  console.log(`Server is running at PORT ${process.env.PORT}`); // Server started successfully
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/messages', messagesRoute);


app.use(express.static(path.join(__dirname, 'frontend/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
