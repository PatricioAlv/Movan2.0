import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const CreateShipmentScreenStyle = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  exampleButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exampleButtonText: {
    color: '#1976D2',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  cargoTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cargoTypeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cargoTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cargoTypeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  cargoTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
  textAreaContainer: {
    marginTop: spacing.xs,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textTextArea,
    minHeight: 100,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  mapButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: spacing.sm,
  },
  mapButtonText: {
    color: '#2E7D32',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  selectedLocation: {
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedLocationText: {
    color: '#2E7D32',
    fontSize: typography.fontSize.sm,
  },
  details:{
    color: colors.textTextArea
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
    marginBottom: spacing.md,
  },
  warningText: {
    color: '#E65100',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  warningPath: {
    color: '#E65100',
    fontSize: typography.fontSize.xs,
    fontFamily: 'monospace',
  }
}

export default CreateShipmentScreenStyle;
