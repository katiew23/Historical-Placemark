import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { testUsers, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite("User API tests", () => {
    
    let createdUsers = [];
    
    setup(async () => {
        db.init("json");
        
        placemarkService.clearAuth();
        
        let user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggie);
        
        // clear database
        await placemarkService.deleteAllUsers();
        
        // recreate admin
        user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggie);
        
        createdUsers = [];
        
        for (let i = 0; i < testUsers.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            createdUsers[i] = await placemarkService.createUser(testUsers[i]);
        }
    });
    
    teardown(async () => {});
    
    test("create a user", async () => {
        const newUser = await placemarkService.createUser(maggie);
        assertSubset(maggie, newUser);
        assert.isDefined(newUser._id);
    });
    
    test("delete all users", async () => {
        let returnedUsers = await placemarkService.getAllUsers();
        assert.equal(returnedUsers.length, testUsers.length + 1);
        
        await placemarkService.deleteAllUsers();
        
        // recreate admin so authentication works again
        await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggie);
        
        returnedUsers = await placemarkService.getAllUsers();
        assert.equal(returnedUsers.length, 1);
    });
    test("get a user - success", async () => {
        const returnedUser = await placemarkService.getUser(createdUsers[0]._id);
        assert.deepEqual(createdUsers[0], returnedUser);
    });
    
    test("get a user - bad id", async () => {
        try {
            await placemarkService.getUser("1234");
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No User with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });
    
    test("get a user - deleted user", async () => {
        await placemarkService.deleteAllUsers();
        
        // recreate admin to restore authentication
        await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggie);
        
        try {
            await placemarkService.getUser(createdUsers[0]._id);
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No User with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });
    
});