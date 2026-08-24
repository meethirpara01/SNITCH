import express from 'express';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import CONFIG from './config/config.js';

import authRoutes from './routers/auth.routes.js';


const app = express();


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
//     credentials: true
// }));
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: CONFIG.GOOGLE_CLIENT_ID,
    clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
},
    (accessToken, refreshToken, profile, done) => {
        // Here you can handle the user profile returned by Google
        // For example, you can find or create a user in your database
        // and then call done(null, user) to pass the user object to the next middleware
        // console.log('Google profile:', profile);
        return done(null, profile);
    }
));


app.use('/api/auth', authRoutes);

export default app;

// GOOGLE AUTHENTICATION FLOW
// User
//  ↓
// /api/auth/google
//  ↓
// Passport
//  ↓
// Google
//  ↓
// User authenticates
//  ↓
// Google gives authorization CODE
//  ↓
// /api/auth/google/callback
//  ↓
// Passport receives AUTHORIZATION CODE
//  ↓
// Passport sends AUTHORIZATION CODE + client credentials → Google. - Request 1_Exchange code for token
//  ↓
// Google verifies AUTHORIZATION CODE
//  ↓
// Google returns ACCESS TOKEN
//  ↓
// Passport uses ACCESS TOKEN
//  ↓
// Passport (HTTP request to Google API) Request 2_Get user information
//    │
//    │ GET /userinfo
//    │ Authorization: Bearer ACCESS_TOKEN
//    ▼
// Google
//    │
//    │ 200 OK
//    │
//    │ {
//    │   id: "...",
//    │   email: "...",
//    │   name: "...",
//    │   picture: "..."
//    │ }
//    ▼
// Google returns user profile T Passport
//  ↓
// Passport calls done(null, profile)
//  ↓
// req.user
//  ↓
// googleCallback()