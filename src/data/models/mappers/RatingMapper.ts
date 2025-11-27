import type { Rating } from '../../../core/entities/Rating';
import type { RatingModel } from '../RatingModel';

export class RatingMapper {
  static toDomain(model: RatingModel): Rating {
    return {
      id: model.id,
      shipmentId: model.shipmentId,
      fromUserId: model.fromUserId,
      fromUserName: model.fromUserName,
      toUserId: model.toUserId,
      toUserName: model.toUserName,
      rating: model.rating,
      comment: model.comment,
      createdAt: new Date(model.createdAt),
    };
  }

  static toModel(rating: Rating): RatingModel {
    return {
      id: rating.id,
      shipmentId: rating.shipmentId,
      fromUserId: rating.fromUserId,
      fromUserName: rating.fromUserName,
      toUserId: rating.toUserId,
      toUserName: rating.toUserName,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt.getTime(),
    };
  }

  static toCreateModel(
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    toUserName: string,
    shipmentId: string,
    rating: number,
    comment?: string
  ): Omit<RatingModel, 'id'> {
    return {
      shipmentId,
      fromUserId,
      fromUserName,
      toUserId,
      toUserName,
      rating,
      comment,
      createdAt: Date.now(),
    };
  }
}
