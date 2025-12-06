import { StyleSheet } from "react-native";
import { spacing } from "../spacing";

const ActiveShipmentScreenStyles = StyleSheet.create({
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
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D32',
  },
  phaseStep: {
    alignItems: 'center',
    opacity: 0.4,
  },
  phaseStepActive: {
    opacity: 1,
  },
  phaseText: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: '#9CA3AF',
  },
  phaseTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  phaseLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#2A2D32',
    marginHorizontal: spacing.md,
  },
  card: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D32',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  address: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  contactInfo: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#25282C',
    borderRadius: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  phoneText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: spacing.xs,
    textDecorationLine: 'underline',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  mapsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  actionsContainer: {
    padding: spacing.md,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default ActiveShipmentScreenStyles;