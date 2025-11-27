import { Rating, CreateRatingData } from '../entities/Rating';

export interface IRatingRepository {
  createRating(fromUserId: string, data: CreateRatingData): Promise<Rating>;
  getRatingsByUser(userId: string): Promise<Rating[]>;
  getRatingsByShipment(shipmentId: string): Promise<Rating[]>;
  hasUserRatedShipment(userId: string, shipmentId: string): Promise<boolean>;
  getUserAverageRating(userId: string): Promise<{ average: number; total: number }>;
}
