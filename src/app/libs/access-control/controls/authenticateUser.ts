import { auth } from 'firebase-admin';

export const authenticateUser = async (idToken: string) =>
    auth().verifyIdToken(idToken);
