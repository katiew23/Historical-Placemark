import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { testUsers, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";
import { maggieCredentials } from "../../src/models/joi-schemas.js";

suite("Admin API tests", () => {
    
    let createdUsers = [];
    
    setup(async () => {
        db.init("json");
        
        placemarkService.clearAuth();
        
        let user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        
        // clear database
        await placemarkService.deleteAllUsers();
        
        // recreate admin
        user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        
        createdUsers = [];
        
        for (let i = 0; i < testUsers.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            createdUsers[i] = await placemarkService.createUser(testUsers[i]);
        }
    });
    
    teardown(async () => {});
    
    test("admin can get all users", async () => {
        const returnedUsers = await placemarkService.getAllUsers();
        assert.equal(returnedUsers.length, testUsers.length +1);
    });
    
    test("admin can delete all users", async () => {
        let returnedUsers = await placemarkService.getAllUsers();
        assert.equal(returnedUsers.length, testUsers.length + 1);
        
        await placemarkService.deleteAllUsers();
        
        // recreate admin so authentication works again
        await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        
        returnedUsers = await placemarkService.getAllUsers();
        assert.equal(returnedUsers.length, 1);
    });
    test("admin can retrieve a specific user", async () => {
        const returnedUser = await placemarkService.getUser(createdUsers[0]._id);
        assert.deepEqual(createdUsers[0], returnedUser);
    });
    
    test("admin retrieving user with bad id", async () => {
        try {
            await placemarkService.getUser("1234");
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No User with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });
    
    test("admin retrieving deleted user returns 404", async () => {
        await placemarkService.deleteAllUsers();
        
        // recreate admin to restore authentication
        await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        
        try {
            await placemarkService.getUser(createdUsers[0]._id);
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No User with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });
    
});