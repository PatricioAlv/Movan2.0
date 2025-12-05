import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { register, login } from '../controllers/authController'; 
import { cancelShipmentController } from '../controllers/shipmentsController';
import { 
  getDriverShipmentsController, 
  getShipmentDetailsController, 
  acceptShipmentController, 
  getAvailableShipmentsController, 
  getShipmentByIdController,
  startPickupController,
  confirmDeliveryController
} from '../controllers/transHomeController';
import { getUserByIdController } from '../controllers/userController';

admin.initializeApp();
const app = express();

app.use(cors({origin: true}));
app.use(express.json());

// routes


// - auth-routes
app.post("/register", register);
app.post("/login", login);

// - user routes
app.get("/users/:userId", getUserByIdController);

// - shipment routes
app.post('/cancelShipment', cancelShipmentController);

// - transportist routes
app.post('/getDriverShipments', getDriverShipmentsController);
app.post('/getShipmentDetails', getShipmentDetailsController);
app.post('/acceptShipment', acceptShipmentController);
app.post("/cancelShipment", cancelShipmentController);
app.get("/shipments/available", getAvailableShipmentsController);
app.get("/shipments/:shipmentId", getShipmentByIdController);
app.get("/shipments/driver/:driverId", getDriverShipmentsController);
app.post("/shipments/startPickup", startPickupController);
app.post("/shipments/confirmDelivery", confirmDeliveryController);


export const api = functions.https.onRequest(app);
