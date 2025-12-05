import * as admin from "firebase-admin";

interface RatingAverage {
  average: number;
  total: number;
}

export async function getUserAverageRating(userId: string): Promise<RatingAverage> {
  const db = admin.database();

  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("toUserId")
    .equalTo(userId)
    .once("value");

  const ratingsData = snapshot.val() || {};
  const ratings = Object.values(ratingsData) as any[];

  if (ratings.length === 0) {
    return {average: 0, total: 0};
  }

  const total = ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
  const average = total / ratings.length;

  return {
    average: Math.round(average * 10) / 10, // Redondear a 1 decimal
    total: ratings.length,
  };
}
