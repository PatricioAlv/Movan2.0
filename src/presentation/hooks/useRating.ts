import { useState } from 'react';
import type { CreateRatingData } from '../../core/entities/Rating';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

export const useRating = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRating = async (fromUserId: string, data: CreateRatingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId,
          shipmentId: data.shipmentId,
          toUserId: data.toUserId,
          rating: data.rating,
          comment: data.comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear calificación');
      }

      const rating = await response.json();
      return rating;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear calificación';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserRating = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/ratings/average/${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener calificación');
      }
      return await response.json();
    } catch (err) {
      console.error('Error getting user rating:', err);
      return { average: 0, total: 0 };
    }
  };

  const checkIfUserRated = async (userId: string, shipmentId: string) => {
    try {
      const response = await fetch(`${API_URL}/ratings/check/${shipmentId}/${userId}`);
      if (!response.ok) {
        throw new Error('Error al verificar calificación');
      }
      const data = await response.json();
      return data.hasRated;
    } catch (err) {
      console.error('Error checking if user rated:', err);
      return false;
    }
  };

  return {
    createRating,
    getUserRating,
    checkIfUserRated,
    isSubmitting,
    error,
  };
};
