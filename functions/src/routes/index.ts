import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {register, login} from "../controllers/authController";
import {
  cancelShipmentController,
  getShipmentByIdController,
  getDriverShipmentsController,
  getAvailableShipmentsController,
  getClientShipmentsController,
  createShipmentController,
  updateShipmentStatusController,
  startPickupController,
  confirmDeliveryController,
  acceptShipmentController,
} from "../controllers/shipmentsController";
import {getUserByIdController, updateUserController} from "../controllers/userController";
import {
  createRatingController,
  getUserRatingsController,
  checkUserRatedController,
  getUserAverageRatingController,
} from "../controllers/ratingsController";

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
app.put("/users/:userId", updateUserController);

// - shipment routes
app.post("/shipments", createShipmentController);
app.get("/shipments/available", getAvailableShipmentsController);
app.get("/shipments/client/:clientId", getClientShipmentsController);
app.get("/shipments/driver/:driverId", getDriverShipmentsController);
app.get("/shipments/:shipmentId", getShipmentByIdController);
app.post("/shipments/cancel", cancelShipmentController);
app.post("/shipments/updateStatus", updateShipmentStatusController);
app.post("/shipments/startPickup", startPickupController);
app.post("/shipments/confirmDelivery", confirmDeliveryController);
app.post("/shipments/accept", acceptShipmentController);

// - rating routes
app.post("/ratings", createRatingController);
app.get("/ratings/user/:userId", getUserRatingsController);
app.get("/ratings/average/:userId", getUserAverageRatingController);
app.get("/ratings/check/:shipmentId/:userId", checkUserRatedController);


export const api = functions.https.onRequest(app);
