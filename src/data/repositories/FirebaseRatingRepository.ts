import { inject, injectable } from 'inversify';
import type { Rating, CreateRatingData } from '../../core/entities/Rating';
import type { IRatingRepository } from '../../core/repositories/IRatingRepository';
import type { IUserRepository } from '../../core/repositories/IUserRepository';
import { FirebaseRealtimeDataSource } from '../datasources/remote/FirebaseRealtimeDataSource';
import { RatingMapper } from '../models/mappers/RatingMapper';
import type { RatingModel } from '../models/RatingModel';
import { TYPES } from '../../infrastructure/di/types';

@injectable()
export class FirebaseRatingRepository implements IRatingRepository {
  private readonly RATINGS_PATH = 'ratings';
  private readonly USER_RATINGS_PATH = 'userRatings';

  constructor(
    @inject(TYPES.FirebaseRealtimeDataSource)
    private firebaseDataSource: FirebaseRealtimeDataSource,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async createRating(fromUserId: string, data: CreateRatingData): Promise<Rating> {
    // Validate rating value
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Get user information
    const fromUser = await this.userRepository.getUserById(fromUserId);
    const toUser = await this.userRepository.getUserById(data.toUserId);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    // Create rating model
    const ratingData = RatingMapper.toCreateModel(
      fromUserId,
      fromUser.name,
      data.toUserId,
      toUser.name,
      data.shipmentId,
      data.rating,
      data.comment
    );

    // Save rating
    const ratingId = await this.firebaseDataSource.push(this.RATINGS_PATH, ratingData);

    // Update user ratings index
    await this.firebaseDataSource.set(
      `${this.USER_RATINGS_PATH}/${data.toUserId}/${ratingId}`,
      true
    );

    // Update user's average rating
    await this.updateUserAverageRating(data.toUserId);

    const ratingModel: RatingModel = {
      id: ratingId,
      shipmentId: ratingData.shipmentId,
      fromUserId: ratingData.fromUserId,
      fromUserName: ratingData.fromUserName,
      toUserId: ratingData.toUserId,
      toUserName: ratingData.toUserName,
      rating: ratingData.rating,
      comment: ratingData.comment,
      createdAt: ratingData.createdAt,
    };

    return RatingMapper.toDomain(ratingModel);
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    const ratingIds = await this.firebaseDataSource.get<Record<string, boolean>>(
      `${this.USER_RATINGS_PATH}/${userId}`
    );

    if (!ratingIds) {
      return [];
    }

    const ratings: Rating[] = [];
    for (const ratingId of Object.keys(ratingIds)) {
      const ratingModel = await this.firebaseDataSource.get<RatingModel>(
        `${this.RATINGS_PATH}/${ratingId}`
      );
      if (ratingModel) {
        ratings.push(RatingMapper.toDomain({ ...ratingModel, id: ratingId }));
      }
    }

    return ratings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRatingsByShipment(shipmentId: string): Promise<Rating[]> {
    const allRatings = await this.firebaseDataSource.query<RatingModel>(
      this.RATINGS_PATH,
      'shipmentId',
      shipmentId
    );

    return allRatings.map((rating) => RatingMapper.toDomain(rating));
  }

  async hasUserRatedShipment(userId: string, shipmentId: string): Promise<boolean> {
    const allRatings = await this.firebaseDataSource.query<RatingModel>(
      this.RATINGS_PATH,
      'shipmentId',
      shipmentId
    );

    return allRatings.some((rating) => rating.fromUserId === userId);
  }

  async getUserAverageRating(userId: string): Promise<{ average: number; total: number }> {
    const ratings = await this.getRatingsByUser(userId);

    if (ratings.length === 0) {
      return { average: 0, total: 0 };
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / ratings.length;

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      total: ratings.length,
    };
  }

  private async updateUserAverageRating(userId: string): Promise<void> {
    const { average, total } = await this.getUserAverageRating(userId);

    await this.firebaseDataSource.update(`users/${userId}`, {
      averageRating: average,
      totalRatings: total,
    });
  }
}
