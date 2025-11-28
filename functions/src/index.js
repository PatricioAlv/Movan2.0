import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// Exportar functions
export { register } from './auth/register';
export { createShipment } from './shipments/createShipment';
export { acceptShipment } from './shipments/acceptShipment';
export { cancelShipment } from './shipments/cancelShipment';
export { createRating } from './ratings/createRating';
export { getUserProfile } from './users/getUserProfile';

// Triggers
export { onShipmentCreated } from './shipments/triggers';
export { onUserCreated } from './auth/triggers';

setGlobalOptions({ maxInstances: 10 });
