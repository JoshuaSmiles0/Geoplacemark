import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testPoi, testPois, testUser } from "./fixtures.js";

let user = null;

suite("Poi Tests", () => {

    setup(async() => {
        db.init();
        await db.userStore.deleteAllUsers();
        await db.poiStore.deleteAllPoi();
        user = await db.userStore.addUser(testUser);
        for (let i = 0; i < testPois.length; i +=1) {
            testPois[i].userid = user._id
            testPois[i] = await db.poiStore.addPoi(testPois[i])
        }
    });

    teardown(async() => {

    });

    test("create a poi", async () => {
            const newPoi = await db.poiStore.addPoi(testPoi);
            assert.deepEqual(newPoi,testPoi);
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
        const desiredPois = await db.poiStore.getPoiByUserId("bad id");
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
        const newPoi = testPoi;
        const id = "1234567"
        newPoi.userid = id
        await db.poiStore.addPoi(newPoi);
        let updatedPois = await db.poiStore.getAllPoi();
        assert.equal(testPois.length + 1, updatedPois.length);
        await db.poiStore.deletePoiByUserId(id);
        updatedPois = await db.poiStore.getAllPoi();
        assert.equal(updatedPois.length,testPois.length);
    });


    test("delete poi by user id - failure", async() => {
        const id = "1234567"
        await db.poiStore.deletePoiByUserId(id);
        const updatedPois = await db.poiStore.getAllPoi();
        assert.equal(updatedPois.length,testPois.length);
    });
});