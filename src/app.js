import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


import authRoutes from './routers/auth.routes.js';
app.use('/api/auth', authRoutes);

export default app;