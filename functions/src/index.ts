import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { register, login } from './controllers/authController'; 

admin.initializeApp();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

//routes

// - auth-routes
app.post('/register', register);
app.post('/login', login);

// - 

export const api = functions.https.onRequest(app);
