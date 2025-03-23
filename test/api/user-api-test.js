import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { testU, testUsers,updatedUser } from "../apiFixtures.js";
import { geoplacemarkService } from "./geoplacemark-service.js";



suite("User API tests", () => {
setup(async () => {
        await geoplacemarkService.deleteAllUsers();
        for (let i = 0; i < testUsers.length; i +=1) {
            testUsers[i] = await geoplacemarkService.createUser(testUsers[i])
        }
    });

    teardown(async() => {

    });


    test("create a user", async () => {
        const newUser = await geoplacemarkService.createUser(updatedUser)
        assertSubset(newUser, updatedUser)
        const returnedUsers = await geoplacemarkService.getAllUsers();
        assert.equal(returnedUsers.length, testUsers.length +1)
    } );


    test("get user by id - success", async() => {
        const user = await geoplacemarkService.getUserById(testUsers[0]._id)
        assert.deepEqual(user, testUsers[0])
    });

    test("get a user by id - fail", async () => {
        try {
          const returnedUser = await geoplacemarkService.getUserById("1234");
          assert.fail("Should not return a response");
        } catch (error) {
          assert(error.response.data.message === "No User with this id");
          assert(error.response.data.statusCode, 503)
        }
      });

    test("get a user by id - failure non existant id", async () => {
        await geoplacemarkService.deleteAllUsers();
        try {
            const returnedUser = await geoplacemarkService.getUserById(testUsers[0]._id)
            assert.fail("should not return a response")
        }
        catch (error) {
            assert(error.response.data.message === "No User with this id");
            assert(error.response.data.statusCode, 404 )
        }

    });

    test("get all users", async () => {
        const users = await geoplacemarkService.getAllUsers()
        assert.equal(testUsers.length, users.length)
    });


    test("delete all users", async () => {
        await geoplacemarkService.deleteAllUsers()
        const users = geoplacemarkService.getAllUsers()
        assert.isEmpty(users)
    });

    test("delete user by id - success", async () => {
        await geoplacemarkService.deleteUserById(testUsers[1]._id)
       const  users = await geoplacemarkService.getAllUsers()
        assert.equal(users.length, testUsers.length -1)
    });

    test("delete user by id - failure bad id", async () => {
        try {
        await geoplacemarkService.deleteUserById("bad id")
        assert.fail("should not return a response")
    }
    catch (error) {
        assert(error.response.data.message === "No User found");
        assert(error.response.data.statusCode, 404 )
    }
    });

    test("update a user - success", async () => {
        await geoplacemarkService.updateUser(testUsers[0]._id, updatedUser);
        const newDetails = await geoplacemarkService.getUserById(testUsers[0]._id)
        assertSubset(updatedUser,newDetails )
    });

    test("update a user - failure bad id", async () => {
        try {
            await geoplacemarkService.updateUser("bad id", updatedUser);
            assert.fail("should not return a response")
        }
        catch (error){
            assert(error.response.data.message === "No User found");
            assert(error.response.data.statusCode, 404 )
        }
    });

    test("update a user - failure bad user", async () => {
        try{
            await geoplacemarkService.updateUser(testUsers[0]._id, "im not a user im a string")
        }
        catch (error) {
            assert(error.response.data.statusCode, 503)
        }
    })




});
