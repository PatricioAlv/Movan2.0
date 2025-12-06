
import { Platform, StyleSheet } from "react-native";
import { spacing } from "../spacing";

const TransShipmentDetailsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111315',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111315',
    padding: spacing.lg,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  mapCard: {
    height: 180,
    backgroundColor: '#1A1D21',
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  mapPlaceholderText: {
    color: '#9CA3AF',
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1A1D21',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pointDetails: {
    flex: 1,
  },
  pointAddress: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  pointDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2D32',
    marginVertical: spacing.md,
    marginLeft: 48,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    width: 24,
    marginRight: spacing.sm,
    textAlign: 'center',
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1D21',
    padding: spacing.md,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2A2D32',
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.md,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#2A2D32',
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  notAvailableContainer: {
    backgroundColor: '#2B2B2B',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  notAvailableText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: spacing.md,
  },
});

export default TransShipmentDetailsScreenStyles;


