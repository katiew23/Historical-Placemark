import { assert } from "chai";
import { firebaseCollectionStore } from "../../src/models/firebase/firebase-collection-store.js";

suite("Firebase Collection Model tests", function () {

  this.timeout(10000);   // increase timeout

  let testCollection = {
    title: "Test Collection",
    userid: "firebase-user"
  };

  test("create a collection in firebase", async () => {

    const result = await firebaseCollectionStore.addCollection(testCollection);

    assert.isDefined(result.id);
    assert.equal(result.title, testCollection.title);
  });

  test("get collection by id", async () => {

    const created = await firebaseCollectionStore.addCollection(testCollection);

    const returned = await firebaseCollectionStore.getCollectionById(created.id);

    assert.equal(returned.title, testCollection.title);
  });

});