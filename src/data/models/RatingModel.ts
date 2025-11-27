export interface RatingModel {
  id: string;
  shipmentId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number;
  comment?: string;
  createdAt: number;
}
