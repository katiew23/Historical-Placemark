import { assert } from "chai";
import { firebasePlacemarkStore } from "../../src/models/firebase/firebase-placemark-store.js";

suite("Firebase Placemark Model tests", () => {

  let testPlacemark = {
    name: "Test Castle",
    description: "Historic site",
    latitude: 52.1,
    longitude: -7.1,
    category: "Castle",
    yearEstablished: 1200,
    county: "Waterford"
  };

  test("create a placemark in firebase", async () => {

    const result = await firebasePlacemarkStore.addPlacemark("test-collection", testPlacemark);

    assert.isDefined(result.id);
    assert.equal(result.name, testPlacemark.name);
  });

  test("get placemarks by collection id", async () => {

    await firebasePlacemarkStore.addPlacemark("firebase-test", testPlacemark);

    const placemarks = await firebasePlacemarkStore.getPlacemarksByCollectionId("firebase-test");

    assert.isArray(placemarks);
    assert.isAtLeast(placemarks.length, 1);
  });

});