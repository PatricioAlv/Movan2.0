import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@presentation/theme/colors';
import { spacing, borderRadius, shadows } from '@presentation/theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        elevated && shadows.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
