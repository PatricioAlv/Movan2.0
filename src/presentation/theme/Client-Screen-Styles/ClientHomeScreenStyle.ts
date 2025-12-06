import { StyleSheet } from "react-native";

const ClientHomeScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Navy Blue Background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    backgroundColor: '#0F172A',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  tabButton: {
    marginRight: 20,
    paddingBottom: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for floating button
  },
  card: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shipmentId: {
    fontSize: 12,
    color: '#64748B', // Slate 500
    marginBottom: 4,
  },
  cargoType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F1F5F9', // Slate 100
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationCity: {
    color: '#E2E8F0', // Slate 200
    fontSize: 14,
    flex: 1,
  },
  routeArrow: {
    marginHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#10B981', // Green for money
    fontWeight: 'bold',
  },
  driverAssignedBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  driverAssignedText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
});

export default ClientHomeScreenStyle;
