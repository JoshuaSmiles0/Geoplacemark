import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testPoi, testPois, testU, updatedPoi, updatedUser } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

let user = null;

suite("Poi Tests", () => {

    setup(async() => {
        db.init("mongo");
        await db.userStore.deleteAllUsers();
        await db.poiStore.deleteAllPoi();
        user = await db.userStore.addUser(updatedUser);
        for (let i = 0; i < testPois.length; i +=1) {
            testPois[i].userid = user._id
            testPois[i].author = user.firstName + user.surname
            testPois[i].iconAddress = "an icon address"
            testPois[i] = await db.poiStore.addPoi(testPois[i])
        }
    });

    teardown(async() => {

    });

    test("create a poi", async () => {
            const newPoi = await db.poiStore.addPoi(testPoi);
           assertSubset(newPoi,testPoi);
            assert.isDefined(newPoi._id);
        });

    test("Delete all Pois", async () => {
        let allPois = await db.poiStore.getAllPoi();
        assert.equal(allPois.length, testPois.length);
        await db.poiStore.deleteAllPoi();
        allPois = await db.poiStore.getAllPoi();
        assert.equal(allPois.length, testPois.length - testPois.length); 
    });

    test("Get all Pois", async () => {
        const allPois = await db.poiStore.getAllPoi();
        assert.equal(allPois.length, testPois.length);
    });

    test("Get Poi by id - success", async () => {
        const allPois = await db.poiStore.getAllPoi();
        const poiId = allPois[0]._id;
        const desiredUser = await db.poiStore.getPoiById(poiId);
        assert.deepEqual(desiredUser, allPois[0]);
    });

    test("Get Poi by id - failure", async () => {
        const poiId = "bad id";
        const desiredUser = await db.poiStore.getPoiById(poiId);
        assert.isNull(desiredUser);
    });


    test("Get Poi by userId - success", async () => {
        const desiredPois = await db.poiStore.getPoiByUserId(user._id);
        assert.equal(desiredPois.length, testPois.length);
    });

    test("Get Poi by userId - failure", async () => {
        const desiredPois = await db.poiStore.getPoiByUserId("badid");
        assert.isEmpty(desiredPois);
    });

    test("Get Poi By Type - success", async () => {
        const newPoi = testPoi;
        newPoi.userid = user._id;
        await db.poiStore.addPoi(newPoi);
        const allPoi = await db.poiStore.getAllPoi();
        assert.equal(allPoi.length, testPois.length + 1);
        const returnedPoi = await db.poiStore.getPoiByType("economic");
        assert.equal(returnedPoi.length, 2);
    });


    test("Get Poi By Type - failure", async () => {
        const newPoi = testPoi;
        newPoi.userid = user._id;
        await db.poiStore.addPoi(newPoi);
        const allPoi = await db.poiStore.getAllPoi();
        assert.equal(allPoi.length, testPois.length + 1);
        const returnedPoi = await db.poiStore.getPoiByType("bad type");
        assert.isEmpty(returnedPoi);
    });

    test("delete a poi by id - success", async() =>{
            let pois = await db.poiStore.getAllPoi();
            assert.equal(pois.length, testPois.length);
            await db.poiStore.deletePoiById(testPois[0]._id);
            const deletedPoi = await db.poiStore.getPoiById(testPois[0]._id);
            assert.isNull(deletedPoi);
            pois = await db.poiStore.getAllPoi();
            assert.equal(pois.length, testPois.length -1);
        });
    
    test("delete a poi by id - failure", async() =>{
            let pois = await db.poiStore.getAllPoi();
            assert.equal(pois.length, testPois.length);
            await db.poiStore.deletePoiById("idq");
            pois = await db.poiStore.getAllPoi();
            assert.equal(pois.length, testPois.length)
        });

    test("delete poi by user id - success", async() => {
        const user = await db.userStore.addUser(updatedUser)
        testPoi.userid = user._id
        testPoi.author = user.firstName + user.surname
        testPoi.iconAddress = "an icon address"
        const newPoi = await db.poiStore.addPoi(testPoi);
        let updatedPois = await db.poiStore.getAllPoi();
        assert.equal(testPois.length + 1, updatedPois.length);
        await db.poiStore.deletePoiByUserId(user._id);
        updatedPois = await db.poiStore.getAllPoi();
        assert.equal(updatedPois.length,testPois.length);
    });


    test("delete poi by user id - failure", async() => {
        const id = "1234567"
        await db.poiStore.deletePoiByUserId(id);
        const updatedPois = await db.poiStore.getAllPoi();
        assert.equal(updatedPois.length,testPois.length);
    });


    test("Get Poi by userId and type - success", async () => {
        const desiredPois = await db.poiStore.getPoiByUserIdType(user._id, testPois[0].type);
        assert.equal(desiredPois.length, 1);
    });

    test("Get Poi By userId and type - failure both params", async () => {
        const newPoi = testPoi;
        newPoi.userid = user._id;
        await db.poiStore.addPoi(newPoi);
        const allPoi = await db.poiStore.getAllPoi();
        assert.equal(allPoi.length, testPois.length + 1);
        const returnedPoi = await db.poiStore.getPoiByUserIdType("bad id", "bad type");
        assert.isEmpty(returnedPoi);
    });

    test("Get Poi By userId and type - failure type param", async () => {
        const newPoi = testPoi;
        newPoi.userid = user._id;
        await db.poiStore.addPoi(newPoi);
        const allPoi = await db.poiStore.getAllPoi();
        assert.equal(allPoi.length, testPois.length + 1);
        const returnedPoi = await db.poiStore.getPoiByUserIdType(newPoi.userId, "bad type");
        assert.isEmpty(returnedPoi);
    });

    test("Get Poi By userId and type - failure id param", async () => {
        const newPoi = testPoi;
        newPoi.userid = user._id;
        await db.poiStore.addPoi(newPoi);
        const allPoi = await db.poiStore.getAllPoi();
        assert.equal(allPoi.length, testPois.length + 1);
        const returnedPoi = await db.poiStore.getPoiByUserIdType("bad id", testPois[0].type);
        assert.isEmpty(returnedPoi);
    });

test("update a poi - success", async() => {
        const newPoi = updatedPoi;
        let poi = await db.poiStore.getPoiById(testPois[0]._id);
        await db.poiStore.updatePoi(poi, newPoi);
        poi = await db.poiStore.getPoiById(testPois[0]._id);
        assert.equal(poi.location,newPoi.location);
        assert.equal(poi.lat, newPoi.lat);
        assert.equal(poi.long, updatedPoi.long);
        assert.equal(poi.type, updatedPoi.type);
        assert.equal(poi.description, updatedPoi.description);

    });

    test("update a poi - failure", async() => {
        const newPoi = updatedPoi;
        let poi = await db.poiStore.getPoiById("Bad Id");
        await db.poiStore.updatePoi(poi, newPoi);
        poi = await db.poiStore.getPoiById(testPois[0]._id);
        assert.notEqual(poi.location,newPoi.location);
        assert.notEqual(poi.lat, newPoi.lat);
        assert.notEqual(poi.long, newPoi.long);
        assert.notEqual(poi.type, newPoi.type);
        assert.notEqual(poi.description, newPoi.description);

    });

    test("update a poi author - success", async() => {
        user.firstName = "A new"
        user.surname = "user"
        await db.poiStore.updatePoiUser(user)
        const updatedPoi = await db.poiStore.getPoiById(testPois[0]._id)
        assert.equal(updatedPoi.author, `${user.firstName} ${user.surname}`)
    });

    test("update a poi author - failure", async() => {
        await db.poiStore.updatePoiUser("bad user")
        const updatedPoi = await db.poiStore.getPoiById(testPois[0]._id)
        assertSubset(updatedPoi, testPois[0])
    });


});