export interface UserModel {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
