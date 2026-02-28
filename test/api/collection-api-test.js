import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { testCollections, corkSites } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite("Collection API tests", () => {

  setup(async () => {
    db.init("json");
    await placemarkService.deleteAllCollections();
    for (let i = 0; i < testCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCollections[i] = await placemarkService.createCollection(testCollections[i]);
    }
  });

  test("create a collection", async () => {
    const newCollection = await placemarkService.createCollection(corkSites);
    assertSubset(corkSites, newCollection);
    assert.isDefined(newCollection._id);
  });

  test("get all collections", async () => {
    const collections = await placemarkService.getAllCollections();
    assert.equal(collections.length, testCollections.length);
  });

  test("get one collection - success", async () => {
    const returnedCollection = await placemarkService.getCollection(testCollections[0]._id);
    assert.equal(returnedCollection.title, testCollections[0].title);
  });

  test("delete a collection", async () => {
  const collection = testCollections[0];
  await placemarkService.deleteCollection(collection._id);
  const collections = await placemarkService.getAllCollections();
  assert.equal(collections.length, testCollections.length - 1);
});

test("remove non-existent collection", async () => {
  try {
    await placemarkService.deleteCollection("non-existent-id");
    assert.fail("should not succeed");
  } catch (err) {
    assert.equal(err.response.status, 404);
  }
});

});
