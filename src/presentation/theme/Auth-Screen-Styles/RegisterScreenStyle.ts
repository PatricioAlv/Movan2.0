
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { StyleSheet } from 'react-native';

const RegisterScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center' as const,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.lg,
    alignItems: 'center' as const,
  },
  InputText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTextArea,
  },
  inputField: {
    backgroundColor: colors.bgLight,
    borderColor: colors.gray500
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  roleLabel: {
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
  },
  roleContainer: {
    flexDirection: 'row' as const,
    top: 5,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    alignItems: 'center' as const,
  },
  roleButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  roleTextSelected: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  MovanText: {
    fontSize: 25
  },
  inputLabel:{
    marginBottom: spacing.sm,
    color: colors.white,
  }
});

export default RegisterScreenStyle;
