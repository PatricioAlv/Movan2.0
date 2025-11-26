import { StyleSheet } from 'react-native';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { colors } from '../colors';

const TransShipmentBrowser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#1a2332',
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    paddingBottom: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabInactive: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#6B7280',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#1a2332',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
    position: 'absolute',
    left: spacing.lg + spacing.sm,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#243447',
    borderRadius: 8,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2a3442',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#243447',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  filterButtonInactive: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  filterTextInactive: {
    color: '#6B7280',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
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
    marginBottom: spacing.sm,
  },
  cargoType: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weightText: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
  },

  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
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

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3442',
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    color: '#9CA3AF',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: typography.fontSize.xs,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#4A90E2',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: '#9CA3AF',
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});

export default TransShipmentBrowser;
