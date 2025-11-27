export interface UserModel {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  averageRating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
}
