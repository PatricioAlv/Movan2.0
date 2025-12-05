import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { StarRating } from './StarRating';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Rating } from '../../../core/entities/Rating';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface RatingListProps {
  userId: string;
}

export const RatingList: React.FC<RatingListProps> = ({ userId }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, [userId]);

  const loadRatings = async () => {
    try {
      const response = await fetch(`${API_URL}/ratings/user/${userId}`);
      if (!response.ok) {
        throw new Error('Error al cargar calificaciones');
      }
      const userRatings = await response.json();
      // Convertir fechas de string a Date
      const ratingsWithDates = userRatings.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      }));
      setRatings(ratingsWithDates);
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const renderRating = ({ item }: { item: Rating }) => (
    <View style={styles.ratingCard}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fromUserName}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <StarRating rating={item.rating} size={16} />
      </View>
      {item.comment && (
        <Text style={styles.comment}>{item.comment}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (ratings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay calificaciones aún</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={ratings}
      keyExtractor={(item) => item.id}
      renderItem={renderRating}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textTextArea,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comment: {
    fontSize: 14,
    color: colors.textTextArea,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
