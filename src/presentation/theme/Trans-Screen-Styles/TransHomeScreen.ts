import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { colors } from '../colors';

const TransHomeScreenStyle = {
  container: { flex: 1, backgroundColor: '#1a2332' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
    flexDirection: 'row',
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

  listContent: { padding: spacing.md },

  card: {
    backgroundColor: '#243447',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  routeArrow: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: spacing.sm,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateText: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
  },

  actionsContainer: { marginTop: spacing.sm },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  }
}

export default TransHomeScreenStyle;
