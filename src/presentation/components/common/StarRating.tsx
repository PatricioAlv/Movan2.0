import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 24,
  editable = false,
  onRatingChange,
  showCount = false,
}) => {
  const handlePress = (selectedRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= Math.floor(rating);
    const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

    if (editable) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(starNumber)}
          style={styles.starContainer}
        >
          <Ionicons
            name={isFilled ? 'star' : isHalfFilled ? 'star-half' : 'star-outline'}
            size={size}
            color={isFilled || isHalfFilled ? colors.rating : colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View key={index} style={styles.starContainer}>
        <Ionicons
          name={isFilled ? 'star' : isHalfFilled ? 'star-half' : 'star-outline'}
          size={size}
          color={isFilled || isHalfFilled ? colors.rating : colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[...Array(maxStars)].map((_, index) => renderStar(index))}
      </View>
      {showCount && rating > 0 && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
