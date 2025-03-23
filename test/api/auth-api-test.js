import { assert } from "chai";
import { geoplacemarkService } from "./geoplacemark-service.js";
import { testU, updatedUser } from "../apiFixtures.js";
import { decodeToken } from "../../src/api/jwt-utils.js";


suite("Authenticate API tests",  () => {

setup(async () => {
    geoplacemarkService.clearAuth();
    const user = await geoplacemarkService.createUser(updatedUser);
    await geoplacemarkService.authenticate(user);
    await geoplacemarkService.deleteAllUsers();
    geoplacemarkService.clearAuth();
        
    });

    teardown(async() => {

    });



    test("authenticate and verify token - success", async () => {
        const user = await geoplacemarkService.createUser(testU);
        const response = await geoplacemarkService.authenticate(user);
        assert(response.success);
        assert.isDefined(response.token);
        const userInfo = decodeToken(response.token);
        assert.equal(userInfo.email, user.email);
        assert.equal(userInfo.userId, user._id)
    });

    test("authenticate against non existant user", async () => {
        const user = testU;
        try {
        const response = await geoplacemarkService.authenticate(testU);
        }
        catch (error) {
            assert(error.response.data.message === "User not found");
            assert(error.response.data.statusCode , 404)
        }  
    });


    test("authenticate against existing user with incorrect password", async () => {
        await geoplacemarkService.createUser(testU);
        testU.password = "Wrong password";
        try {
            const response = await geoplacemarkService.authenticate(testU);
        }
        catch (error) {
            assert(error.response.data.message === "Invalid password");
        }
    });

    test("authenticate against existing user with incorrect email", async () => {
        await geoplacemarkService.createUser(testU);
        testU.email = "Wrong email";
        try {
            const response = await geoplacemarkService.authenticate(testU);
        }
        catch (error) {
            assert(error.response.data.message === "User not found");
            assert(error.response.data.statusCode === 401)
        }
    });

    test("authenticate against existing user with correct email and password, no auth", async () => {
        const u = await geoplacemarkService.createUser(updatedUser);
        try {
            const response = await geoplacemarkService.authenticate(testU);
        }
        catch (error) {
            assert(error.response.data.message === "User not found");
            assert(error.response.data.statusCode === 401);
        }
    });

    test("check Unauthorized", async () => {
        geoplacemarkService.clearAuth();
        try {
          await geoplacemarkService.deleteAllUsers();
        } catch (error) {
          assert(error.response.data.statusCode === 401);
        }
      })

});