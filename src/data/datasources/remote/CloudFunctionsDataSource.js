import { getFunctions, httpsCallable } from 'firebase/functions';
import { injectable } from 'inversify';

@injectable()
export class CloudFunctionsDataSource {
  functions = getFunctions();

  async callFunction(functionName, data) {
    try {
      const callable = httpsCallable(this.functions, functionName);
      const result = await callable(data);
      return result.data;
    } catch (error) {
      throw new Error(error.message || 'Error al llamar a Cloud Function');
    }
  }

  // Auth
  async register(email, password, name, role) {
    return this.callFunction('register', { email, password, name, role });
  }

  // Shipments
  async createShipment(shipmentData) {
    return this.callFunction('createShipment', shipmentData);
  }

  async acceptShipment(shipmentId) {
    return this.callFunction('acceptShipment', { shipmentId });
  }

  async cancelShipment(shipmentId, reason) {
    return this.callFunction('cancelShipment', { shipmentId, reason });
  }

  // Ratings
  async createRating(shipmentId, rating, comment) {
    return this.callFunction('createRating', { shipmentId, rating, comment });
  }
}
z