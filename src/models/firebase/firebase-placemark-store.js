import admin from "firebase-admin";
import serviceAccount from "../../config/firebase-key.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore = admin.firestore();

export const firebasePlacemarkStore = {

  async addPlacemark(collectionId, placemark) {
    const doc = await firestore.collection("placemarks").add({
      collectionId,
      ...placemark
    });
    return { id: doc.id, collectionId, ...placemark };
  },

  async getPlacemarksByCollectionId(collectionId) {
    const snapshot = await firestore
      .collection("placemarks")
      .where("collectionId", "==", collectionId)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getPlacemarkById(id) {
    const doc = await firestore.collection("placemarks").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  },

  async deletePlacemark(id) {
    await firestore.collection("placemarks").doc(id).delete();
  },

  async deleteAll() {
    const snapshot = await firestore.collection("placemarks").get();
    const batch = firestore.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

};