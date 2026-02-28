import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCollections, testPlacemarks, blarneyCastle } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {
  let corkCollection = null;

  setup(async () => {
    db.init("json");
    await db.collectionStore.deleteAllCollections();
    await db.placemarkStore.deleteAllPlacemarks();
    corkCollection = await db.collectionStore.addCollection(testCollections[0]);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addPlacemark(
        corkCollection._id,
        testPlacemarks[i]
      );
    }
  });

  test("create single placemark", async () => {
    const dublinCollection = await db.collectionStore.addCollection(testCollections[1]);
    const placemark = await db.placemarkStore.addPlacemark(
      dublinCollection._id,
      blarneyCastle
    );
    assert.isNotNull(placemark._id);
    assertSubset(blarneyCastle, placemark);
  });

  test("create multiple placemarkApi", async () => {
    const collection = await db.collectionStore.getCollectionById(corkCollection._id);
    const placemarks = await db.placemarkStore.getPlacemarksByCollectionId(collection._id);
    assert.equal(testPlacemarks.length, placemarks.length);
  });

  test("delete all placemarkApi", async () => {
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, placemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    const newplacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, newplacemarks.length);
  });

  test("get a placemark - success", async () => {
    const dublinCollection = await db.collectionStore.addCollection(testCollections[1]);
    const placemark = await db.placemarkStore.addPlacemark(
      dublinCollection._id,
      blarneyCastle
    );
    const newplacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assertSubset(blarneyCastle, newplacemark);
  });

  test("delete One placemark - success", async () => {
    await db.placemarkStore.deletePlacemarkById(testPlacemarks[0]._id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testPlacemarks.length - 1);
    const deletedplacemark = await db.placemarkStore.getPlacemarkById(
      testPlacemarks[0]._id
    );
    assert.isNull(deletedplacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete one placemark - fail", async () => {
    await db.placemarkStore.deletePlacemarkById("bad-id");
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testPlacemarks.length);
  });
});