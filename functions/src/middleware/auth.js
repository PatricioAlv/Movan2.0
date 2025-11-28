import * as functions from 'firebase-functions';

export const requireAuth = (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes iniciar sesión para realizar esta acción'
    );
  }
  return context.auth.uid;
};

export const requireRole = (context, requiredRole) => {
  requireAuth(context);

  const userRole = context.auth?.token.role;
  if (userRole !== requiredRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      `Esta acción requiere rol de ${requiredRole}`
    );
  }
};
