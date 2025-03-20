import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testUser,testPoi, testRating, testRatings } from "./fixtures.js";

let user = null;
let poi = null;

suite("Rating Tests", () => {

setup(async() => {
        db.init();
        await db.userStore.deleteAllUsers();
        await db.poiStore.deleteAllPoi();
        await db.ratingStore.deleteAllRatings();
        user = await db.userStore.addUser(testUser);
        poi = await db.poiStore.addPoi(testPoi);
        for (let i = 0; i < testRatings.length; i +=1) {
            testRatings[i] = await db.ratingStore.addRating(poi._id, user._id, testRatings[i])
        }
    });

teardown(async() => {

});

test("add a rating", async () => {
    const newRating = await db.ratingStore.addRating(poi._id, user._id, testRating);
    assert.deepEqual(newRating,testRating);
    assert.isDefined(newRating._id);
    assert.isDefined(newRating.userid);
    assert.isDefined(newRating.poiid);
});

test("Delete all Ratings", async () => {
        let allRatings = await db.ratingStore.getAllRatings();
        assert.equal(allRatings.length, testRatings.length);
        await db.ratingStore.deleteAllRatings();
        allRatings = await db.ratingStore.getAllRatings();
        assert.equal(allRatings.length, testRatings.length - testRatings.length); 
});

test("Get all Ratings", async () => {
        const allRatings = await db.ratingStore.getAllRatings();
        assert.equal(allRatings.length, testRatings.length);
});

test("Get Rating by id - success", async () => {
    const allRatings = await db.ratingStore.getAllRatings();
    const ratingId = allRatings[0]._id;
    const desiredRating = await db.ratingStore.getRatingById(ratingId);
    assert.deepEqual(desiredRating, allRatings[0]);
});

test("Get Rating by id - failure", async () => {
    const ratingId = "bad id";
    const desiredRating = await db.ratingStore.getRatingById(ratingId);
    assert.isNull(desiredRating);
});

test("Get Ratings by userId - success", async () => {
        const desiredRating = await db.ratingStore.getRatingsByUserId(user._id);
        assert.equal(desiredRating.length, testRatings.length);
});

test("Get Ratings by userId - failure", async () => {
    const desiredRating = await db.ratingStore.getRatingsByUserId("bad id");
    assert.isEmpty(desiredRating);
});

test("Get Ratings by rating value - success", async () => {
    const desiredRating = await db.ratingStore.getRatingsByRatingValue(testRatings[0].rating);
    assert.equal(desiredRating.length, 1);
});

test("Get Ratings by rating - failure", async () => {
const desiredRating = await db.ratingStore.getRatingsByRatingValue("bad rating");
assert.isEmpty(desiredRating);
});

test("Get Ratings by poiId - success", async () => {
    const desiredRating = await db.ratingStore.getRatingsByPoiId(poi._id);
    assert.equal(desiredRating.length, testRatings.length);
});

test("Get Ratings by poiId - failure", async () => {
    const desiredRating = await db.ratingStore.getRatingsByPoiId("bad id");
    assert.isEmpty(desiredRating);
});

test("delete a rating by id - success", async() =>{
            let ratings = await db.ratingStore.getAllRatings();
            assert.equal(ratings.length, testRatings.length);
            await db.ratingStore.deleteRatingById(testRatings[0]._id);
            const deletedRating = await db.ratingStore.getRatingById(testRatings[0]._id);
            assert.isNull(deletedRating);
            ratings = await db.ratingStore.getAllRatings();
            assert.equal(ratings.length, testRatings.length -1);
        });
    
    test("delete a rating by id - failure", async() =>{
            let ratings = await db.ratingStore.getAllRatings();
            assert.equal(ratings.length, testRatings.length);
            await db.ratingStore.deleteRatingById("idq");
            ratings = await db.ratingStore.getAllRatings();
            assert.equal(ratings.length, testRatings.length)
        });
    
    
test("delete rating by user id - success", async() => {
        const newRating = testRating;
        const userId = "1234567"
        const poiId = "7654321"
        await db.ratingStore.addRating(poiId,userId,newRating);
        let updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(testRatings.length + 1, updatedRatings.length);
        await db.ratingStore.deleteRatingsByUserId(userId);
        updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(updatedRatings.length,testRatings.length);
    });


    test("delete rating by user id - failure", async() => {
        const userId = "1234567"
        await db.ratingStore.deleteRatingsByUserId(userId);
        const updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(updatedRatings.length,testRatings.length);
    });

    test("delete rating by poi id - success", async() => {
        const newRating = testRating;
        const userId = "1234567"
        const poiId = "7654321"
        await db.ratingStore.addRating(poiId,userId,newRating);
        let updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(testRatings.length + 1, updatedRatings.length);
        await db.ratingStore.deleteRatingsByPoiId(poiId);
        updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(updatedRatings.length,testRatings.length);
    });


    test("delete rating by poi id - failure", async() => {
        const userId = "1234567"
        await db.ratingStore.deleteRatingsByPoiId(userId);
        const updatedRatings = await db.ratingStore.getAllRatings();
        assert.equal(updatedRatings.length,testRatings.length);
    });

        test("Get Rating by poiId and rating - success", async () => {
            const desiredRatings = await db.ratingStore.getRatingsByPoiIdRating(poi._id, testRatings[0].rating);
            assert.equal(desiredRatings.length, 1);
        });
    
        test("Get Rating By poiId and rating - failure both params", async () => {
            const newRating = testRating;
            await db.ratingStore.addRating(poi._id, user._id, newRating);
            const allRatings = await db.ratingStore.getAllRatings();
            assert.equal(allRatings.length, testRatings.length + 1);
            const returnedRating = await db.ratingStore.getRatingsByPoiIdRating("bad id", "bad rating");
            assert.isEmpty(returnedRating);
        });
    
        test("Get Rating By poiId and rating - failure _id param", async () => {
            const newRating = testRating;
            await db.ratingStore.addRating(poi._id, user._id, newRating);
            const allRatings = await db.ratingStore.getAllRatings();
            assert.equal(allRatings.length, testRatings.length + 1);
            const returnedRating = await db.ratingStore.getRatingsByPoiIdRating("bad id", testRating.rating);
            assert.isEmpty(returnedRating);
        });
    
        test("Get Rating By poiId and rating - failure rating param", async () => {
            const newRating = testRating;
            await db.ratingStore.addRating(poi._id, user._id, newRating);
            const allRatings = await db.ratingStore.getAllRatings();
            assert.equal(allRatings.length, testRatings.length + 1);
            const returnedRating = await db.ratingStore.getRatingsByPoiIdRating(testRating.poiid, "bad rating");
            assert.isEmpty(returnedRating);
        });

    
});