import { StyleSheet } from 'react-native';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: '#EF4444',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#1a2332',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3442',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: spacing.xl,
  },

  // Secciones
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#6B7280',
    marginBottom: spacing.md,
    letterSpacing: 1,
  },

  // Header Info
  headerInfo: {
    backgroundColor: '#243447',
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  shipmentId: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },

  // Transportista
  driverCard: {
    backgroundColor: '#243447',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  driverEmail: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
    marginBottom: spacing.xs,
  },
  driverPhone: {
    fontSize: typography.fontSize.sm,
    color: '#10B981',
  },
  driverPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoNote: {
    fontSize: typography.fontSize.xs,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  callButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.sm,
  },
  callButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },

  // Ruta
  routeCard: {
    backgroundColor: '#243447',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 4,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#4B5563',
    marginLeft: 11,
    marginVertical: spacing.sm,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  locationAddress: {
    fontSize: typography.fontSize.base,
    color: '#E5E7EB',
    marginBottom: spacing.xs,
  },
  contactInfo: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },

  // Detalles
  detailsCard: {
    backgroundColor: '#243447',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3442',
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
    flex: 1,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    color: '#E5E7EB',
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: typography.fontSize.lg,
    color: '#10B981',
    fontWeight: typography.fontWeight.bold,
    flex: 1,
    textAlign: 'right',
  },

  // Botón cancelar
  cancelButton: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    gap: spacing.sm,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
});
