import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const LoginScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttons: {
    marginTop: spacing.md,
    backgroundColor: colors.bgLight,
    color: colors.gray500
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: 2,
  },
  registerButton: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
  },
  registerText: {
    top: 20,
    fontSize: typography.fontSize.sm,
    color: colors.white,
  },
  registerTextBold: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
  },
  inputLabel: {
    marginBottom: spacing.sm,
    color: colors.white,
  },
  logginButton: {
    top: 5
  },
  goToRegister: {
    top: 7
  },
  inputField: {
    backgroundColor: colors.bgLight,
    borderColor: colors.gray500
  },
});

export default LoginScreenStyle;