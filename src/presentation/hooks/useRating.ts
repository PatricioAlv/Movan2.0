import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { CreateRatingUseCase } from '../../core/usecases/ratings/CreateRatingUseCase';
import { GetUserAverageRatingUseCase } from '../../core/usecases/ratings/GetUserAverageRatingUseCase';
import { HasUserRatedShipmentUseCase } from '../../core/usecases/ratings/HasUserRatedShipmentUseCase';
import type { CreateRatingData } from '../../core/entities/Rating';

export const useRating = () => {
  const createRatingUseCase = container.get<CreateRatingUseCase>(
    TYPES.CreateRatingUseCase
  );
  const getUserAverageRatingUseCase = container.get<GetUserAverageRatingUseCase>(
    TYPES.GetUserAverageRatingUseCase
  );
  const hasUserRatedShipmentUseCase = container.get<HasUserRatedShipmentUseCase>(
    TYPES.HasUserRatedShipmentUseCase
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRating = async (fromUserId: string, data: CreateRatingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const rating = await createRatingUseCase.execute(fromUserId, data);
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
      return await getUserAverageRatingUseCase.execute(userId);
    } catch (err) {
      console.error('Error getting user rating:', err);
      return { average: 0, total: 0 };
    }
  };

  const checkIfUserRated = async (userId: string, shipmentId: string) => {
    try {
      return await hasUserRatedShipmentUseCase.execute(userId, shipmentId);
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
