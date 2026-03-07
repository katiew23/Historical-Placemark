import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { corkSites, testPlacemarks } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite("Placemark API tests", () => {

  let collection;
  let createdPlacemarks = [];

  setup(async () => {
    db.init("json");
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllCollections();

    collection = await placemarkService.createCollection(corkSites);

    createdPlacemarks = [];

    for (let i = 0; i < testPlacemarks.length; i += 1) {
      createdPlacemarks[i] =
        await placemarkService.createPlacemark(
          collection._id,
          testPlacemarks[i]
        );
    }
  });

  test("create a placemark", async () => {
    const newPlacemark =
      await placemarkService.createPlacemark(
        collection._id,
        testPlacemarks[0]
      );

    assertSubset(testPlacemarks[0], newPlacemark);
    assert.isDefined(newPlacemark._id);
  });

  test("get all placemarks", async () => {
    const placemarks =
      await placemarkService.getAllPlacemarks();

    assert.equal(placemarks.length, testPlacemarks.length);
  });

  test("get one placemark - success", async () => {
    const returnedPlacemark =
    await placemarkService.getPlacemark(createdPlacemarks[0]._id);
    assertSubset(testPlacemarks[0], returnedPlacemark);
  });
  

  test("delete a placemark", async () => {
    const placemark = createdPlacemarks[0];

    await placemarkService.deletePlacemark(placemark._id);

    try {
      await placemarkService.getPlacemark(placemark._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 404);
    }
  });

    test("get non-existent placemark", async () => {
    try {
      await placemarkService.getPlacemark("non-existent-id");
      assert.fail("should not succeed");
    } catch (err) {
      assert.equal(err.response.status, 404);
    }
  });

  test("invalid information for creating placemark", async () => {
    try {
      await placemarkService.createPlacemark(collection._id, { name: "" });
      assert.fail("should not succeed");
    } catch (err) {
      assert.equal(err.response.status, 400);
    }
  });


});