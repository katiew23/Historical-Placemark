import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { testCollections, corkSites, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite("Collection API tests", () => {
  
  let createdCollections = [];
  
  setup(async () => {
    db.init("json");
    
    placemarkService.clearAuth();
    
    const user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    
    await placemarkService.deleteAllCollections();
    
    createdCollections = [];
    
    for (let i = 0; i < testCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const created = await placemarkService.createCollection(testCollections[i]);
      createdCollections.push(created);
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
    
    for (let i = 0; i < testCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const returnedCollection = await placemarkService.getCollection(createdCollections[i]._id);
      assertSubset(testCollections[i], returnedCollection);
    }
  });
  
  test("get one collection - success", async () => {
    const returnedCollection = await placemarkService.getCollection(createdCollections[0]._id);
    assertSubset(createdCollections[0], returnedCollection);
  });
  
  test("delete a collection", async () => {
    const collection = createdCollections[0];
    await placemarkService.deleteCollection(collection._id);
    const collections = await placemarkService.getAllCollections();
    assert.equal(collections.length, createdCollections.length - 1);
  });
  
  test("remove non-existent collection", async () => {
    try {
      await placemarkService.deleteCollection("non-existent-id");
      assert.fail("should not succeed");
    } catch (err) {
      assert.equal(err.response.status, 404);
    }
  });
  
  test("get non-existent collection", async () => {
    try {
      await placemarkService.getCollection("non-existent-id");
      assert.fail("should not succeed");
    } catch (err) {
      assert.equal(err.response.status, 404);
    }
  });
  
  test("invalid information for creating collection", async () => {
    try {
      await placemarkService.createCollection({ name: "" });
      assert.fail("should not succeed");
    } catch (err) {
      assert.equal(err.response.status, 400);
    }
  });
  
});