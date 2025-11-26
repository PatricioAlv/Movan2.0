import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const CreateShipmentScreenStyle = {
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
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
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  exampleButton: {
    backgroundColor: '#243447',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignSelf: 'flex-start' as const,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  exampleButtonText: {
    color: '#4A90E2',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    backgroundColor: '#243447',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  halfInput: {
    width: '48%',
  },
  cargoTypeContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
  cargoTypeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A5568',
    backgroundColor: '#1a2332',
  },
  cargoTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  cargoTypeText: {
    fontSize: typography.fontSize.sm,
    color: '#E5E7EB',
  },
  cargoTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
  textAreaContainer: {
    marginTop: spacing.xs,
  },
  textArea: {
    backgroundColor: '#1a2332',
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: '#E5E7EB',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  mapButton: {
    backgroundColor: '#1a2332',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: spacing.sm,
  },
  mapButtonText: {
    color: '#10B981',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center' as const,
  },
  selectedLocation: {
    backgroundColor: '#1F2937',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  selectedLocationText: {
    color: '#10B981',
    fontSize: typography.fontSize.sm,
  },
  details:{
    color: '#E5E7EB',
    backgroundColor: '#1a2332',
    borderColor: '#4A5568',
  },
  warningBox: {
    backgroundColor: '#2D1B1B',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginBottom: spacing.md,
  },
  warningText: {
    color: '#FCD34D',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  warningPath: {
    color: '#FCD34D',
    fontSize: typography.fontSize.xs,
    fontFamily: 'monospace',
  }
}

export default CreateShipmentScreenStyle;
