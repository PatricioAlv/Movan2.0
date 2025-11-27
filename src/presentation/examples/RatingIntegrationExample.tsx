// Ejemplo de integración del sistema de rating en ShipmentDetailScreen
// Este archivo muestra cómo integrar el sistema de calificaciones

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { RatingModal } from '../components/common/RatingModal';
import { UserRatingDisplay } from '../components/common/UserRatingDisplay';
import { useRating } from '../hooks/useRating';
import { ShipmentStatus } from '../../core/entities/Order';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// Props de ejemplo
interface ExampleShipmentDetailProps {
  shipment: any; // Tu tipo Shipment
  currentUser: any; // Tu tipo User
  isClient: boolean; // true si es cliente, false si es transportista
}

export const ExampleRatingIntegration: React.FC<ExampleShipmentDetailProps> = ({
  shipment,
  currentUser,
  isClient,
}) => {
  const { createRating, checkIfUserRated } = useRating();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Usuario a calificar
  const targetUser = isClient
    ? { id: shipment.driverId, name: shipment.driverName }
    : { id: shipment.clientId, name: 'Cliente' }; // Deberías obtener el nombre del cliente

  useEffect(() => {
    // Verificar si ya calificó cuando el envío está completado
    if (shipment.status === ShipmentStatus.DELIVERED && targetUser.id) {
      checkRating();
    }
  }, [shipment.status]);

  const checkRating = async () => {
    const rated = await checkIfUserRated(currentUser.id, shipment.id);
    setHasRated(rated);
  };

  const handleSubmitRating = async (rating: number, comment?: string) => {
    try {
      await createRating(currentUser.id, {
        shipmentId: shipment.id,
        toUserId: targetUser.id,
        rating,
        comment,
      });

      Alert.alert(
        'Éxito',
        'Tu calificación ha sido enviada',
        [{ text: 'OK', onPress: () => setHasRated(true) }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo enviar la calificación. Intenta nuevamente.'
      );
      throw error;
    }
  };

  // Solo mostrar si el envío está completado
  if (shipment.status !== ShipmentStatus.DELIVERED) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isClient ? 'Transportista' : 'Cliente'}
        </Text>
        
        {/* Mostrar nombre del usuario */}
        <Text style={styles.userName}>{targetUser.name}</Text>

        {/* Mostrar promedio de calificaciones del usuario */}
        {isClient && shipment.driverId && (
          <UserRatingDisplay
            averageRating={shipment.driverAverageRating} // Asumiendo que tienes esto
            totalRatings={shipment.driverTotalRatings}   // Asumiendo que tienes esto
            size="medium"
          />
        )}
      </View>

      {/* Botón para calificar */}
      <View style={styles.section}>
        {hasRated ? (
          <View style={styles.ratedContainer}>
            <Text style={styles.ratedText}>
              ✓ Ya calificaste este envío
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => setShowRatingModal(true)}
          >
            <Text style={styles.rateButtonText}>
              Calificar {isClient ? 'Transportista' : 'Cliente'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de calificación */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        targetUserName={targetUser.name}
        userType={isClient ? 'driver' : 'client'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  rateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ratedContainer: {
    backgroundColor: colors.success + '20',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.success,
  },
  ratedText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
});
