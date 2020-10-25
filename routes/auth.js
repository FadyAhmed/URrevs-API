var admin = require('firebase-admin');

export async function verifyUser(idToken, userId) {
    const decodedToken = await
        admin.auth().verifyIdToken(idToken);

    return decodedToken.uid == userId;
}