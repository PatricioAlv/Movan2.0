import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const ClientHomeScreenStyle = {
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#1a2332',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3442',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    gap: spacing.lg,
  },
  tabActive: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    paddingBottom: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabInactive: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: '#6B7280',
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: '#243447',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: spacing.md,
  },
  shipmentId: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cargoType: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  routeContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationPoint: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationCity: {
    fontSize: typography.fontSize.sm,
    color: '#E5E7EB',
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  routeArrow: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.sm,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: '#E5E7EB',
    fontWeight: typography.fontWeight.medium,
  },
  priceValue: {
    fontSize: typography.fontSize.base,
    color: '#4A90E2',
    fontWeight: typography.fontWeight.bold,
  },
  cancelButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: '#3F2626',
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: '#1a2332',
    borderTopWidth: 1,
    borderTopColor: '#2a3442',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: '#9CA3AF',
    textAlign: 'center' as const,
  },
}

export default ClientHomeScreenStyle;
