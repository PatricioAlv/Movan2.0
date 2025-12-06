import { StyleSheet } from "react-native";
import { spacing } from "../spacing";

const MyShipmentDetailsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111315',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111315',
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  headerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  shipmentId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  cargoDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  contactText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: spacing.xs,
  },
  phoneLink: {
    color: '#10B981',
    textDecorationLine: 'underline',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: spacing.md,
    justifyContent: 'center',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  infoRow: {
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2D32',
    marginVertical: spacing.md,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  deliveryButton: {
    backgroundColor: '#10B981',
  },
  completedContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  rateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ratedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  ratedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 

export default MyShipmentDetailsScreenStyles;
