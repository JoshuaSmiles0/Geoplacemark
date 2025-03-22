import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testU, testUsers,updatedUser } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";


suite("User Tests", () => {

    setup(async() => {
        db.init("mongo");
        await db.userStore.deleteAllUsers();
        for (let i = 0; i < testUsers.length; i +=1) {
            testUsers[i] = await db.userStore.addUser(testUsers[i])
        }
    });

    teardown(async() => {

    });

    test("create a user", async () => {
        const newUser = await db.userStore.addUser(updatedUser);
        assertSubset(newUser,testU);
    });

    test("delete a user by id - success", async() =>{
        let users = await db.userStore.getAllUsers();
        assert.equal(users.length, testUsers.length);
        await db.userStore.deleteUserById(testUsers[0]._id);
        const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
        assert.isNull(deletedUser);
        users = await db.userStore.getAllUsers();
        assert.equal(users.length, testUsers.length -1);

    });

    test("delete a user by id - failure", async() =>{
        let users = await db.userStore.getAllUsers();
        assert.equal(users.length, testUsers.length);
        await db.userStore.deleteUserById("idq");
        users = await db.userStore.getAllUsers();
        assert.equal(users.length, testUsers.length)

    });

    test("get user by id - success", async() => {
        const user = await db.userStore.addUser(updatedUser);
        const desiredUser = await db.userStore.getUserById(user._id);
        assert.deepEqual(user, desiredUser);
    });

    test("get user by id - failure", async() => {
        const desiredUser = await db.userStore.getUserById("bad id")
        assert.isNull(desiredUser);
    });

    test("get user by email - success", async() => {
        const user = await db.userStore.addUser(updatedUser);
        const desiredUser = await db.userStore.getUserByEmail(user.email);
        assert.deepEqual(user, desiredUser);
    });

    test("get user by email - failure", async() => {
        const desiredUser = await db.userStore.getUserByEmail("bad email")
        assert.isNull(desiredUser);

    });

    test("delete all users", async() => {
        let allUsers = await db.userStore.getAllUsers();
        assert.equal(allUsers.length, 3);
        await db.userStore.deleteAllUsers();
        allUsers = await db.userStore.getAllUsers();
        assert.equal(allUsers.length,0)
    });


    test("update a user - success", async() => {
        const newDetails = updatedUser;
        let user = await db.userStore.getUserById(testUsers[0]._id);
        await db.userStore.updateUserDetails(user, newDetails);
        user = await db.userStore.getUserById(testUsers[0]._id);
        assert.equal(user.firstName,newDetails.firstName);
        assert.equal(user.surname, newDetails.surname);
        assert.equal(user.email, updatedUser.email);
        assert.equal(user.password, updatedUser.password);

    });

    test("update a user - failure", async() => {
        const newDetails = updatedUser;
        let user = await db.userStore.getUserById("Bad Id");
        await db.userStore.updateUserDetails(user, newDetails);
        user = await db.userStore.getUserById(testUsers[0]._id);
        assert.notEqual(user.firstName,newDetails.firstName);
        assert.notEqual(user.surname, newDetails.surname);
        assert.notEqual(user.email, updatedUser.email);
        assert.notEqual(user.password, updatedUser.password);

    })






})
