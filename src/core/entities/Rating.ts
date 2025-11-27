export interface Rating {
  id: string;
  shipmentId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: Date;
}

export interface CreateRatingData {
  shipmentId: string;
  toUserId: string;
  rating: number;
  comment?: string;
}
