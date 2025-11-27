import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StarRating } from './StarRating';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface UserRatingDisplayProps {
  averageRating?: number;
  totalRatings?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const UserRatingDisplay: React.FC<UserRatingDisplayProps> = ({
  averageRating = 0,
  totalRatings = 0,
  size = 'medium',
  showLabel = true,
}) => {
  const starSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;

  if (totalRatings === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noRatingText, { fontSize }]}>
          Sin calificaciones
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StarRating rating={averageRating} size={starSize} showCount />
      {showLabel && (
        <Text style={[styles.countText, { fontSize }]}>
          ({totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  noRatingText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  countText: {
    color: colors.textSecondary,
  },
});
