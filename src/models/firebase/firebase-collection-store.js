import admin from "firebase-admin";
import serviceAccount from "../../config/firebase-key.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore = admin.firestore();

export const firebaseCollectionStore = {

  async addCollection(collection) {
    const doc = await firestore.collection("collections").add(collection);
    return { id: doc.id, ...collection };
  },

  async getCollectionById(id) {
    const doc = await firestore.collection("collections").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  },

  async getAllCollections() {
    const snapshot = await firestore.collection("collections").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

};