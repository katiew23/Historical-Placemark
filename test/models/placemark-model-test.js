import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCollections, testPlacemarks, blarneyCastle } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {
  let corkCollection = null;

  setup(async () => {
    db.init("json");
    await db.collectionStore.deleteAllcollections();
    await db.placemarkStore.deleteAllplacemarks();
    corkCollection = await db.collectionStore.addcollection(testCollections[0]);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addplacemark(
        corkCollection._id,
        testPlacemarks[i]
      );
    }
  });

  test("create single placemark", async () => {
    const dublinCollection = await db.collectionStore.addcollection(testCollections[1]);
    const placemark = await db.placemarkStore.addplacemark(
      dublinCollection._id,
      blarneyCastle
    );
    assert.isNotNull(placemark._id);
    assertSubset(blarneyCastle, placemark);
  });

  test("create multiple placemarkApi", async () => {
    const collection = await db.collectionStore.getcollectionById(corkCollection._id);
    const placemarks = await db.placemarkStore.getplacemarksBycollectionId(collection._id);
    assert.equal(testPlacemarks.length, placemarks.length);
  });

  test("delete all placemarkApi", async () => {
    const placemarks = await db.placemarkStore.getAllplacemarks();
    assert.equal(testPlacemarks.length, placemarks.length);
    await db.placemarkStore.deleteAllplacemarks();
    const newplacemarks = await db.placemarkStore.getAllplacemarks();
    assert.equal(0, newplacemarks.length);
  });

  test("get a placemark - success", async () => {
    const dublinCollection = await db.collectionStore.addcollection(testCollections[1]);
    const placemark = await db.placemarkStore.addplacemark(
      dublinCollection._id,
      blarneyCastle
    );
    const newplacemark = await db.placemarkStore.getplacemarkById(placemark._id);
    assertSubset(blarneyCastle, newplacemark);
  });

  test("delete One placemark - success", async () => {
    await db.placemarkStore.deleteplacemark(testPlacemarks[0]._id);
    const placemarks = await db.placemarkStore.getAllplacemarks();
    assert.equal(placemarks.length, testPlacemarks.length - 1);
    const deletedplacemark = await db.placemarkStore.getplacemarkById(
      testPlacemarks[0]._id
    );
    assert.isNull(deletedplacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getplacemarkById(""));
    assert.isNull(await db.placemarkStore.getplacemarkById());
  });

  test("delete one placemark - fail", async () => {
    await db.placemarkStore.deleteplacemark("bad-id");
    const placemarks = await db.placemarkStore.getAllplacemarks();
    assert.equal(placemarks.length, testPlacemarks.length);
  });
});