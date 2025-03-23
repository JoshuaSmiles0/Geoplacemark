import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { testU,  testUsers,updatedUser, testPoi, testPois, updatedPoi, testRating, testRatings, updatedRating, testCredentials, testApiUsers } from "../apiFixtures.js";
import { geoplacemarkService } from "./geoplacemark-service.js";





suite("rating API tests", () => {
setup(async () => {
        geoplacemarkService.clearAuth()
        let u = await geoplacemarkService.createUser(testApiUsers[2]);
        await geoplacemarkService.authenticate(testCredentials[2]);
        await geoplacemarkService.deleteAllPois();
        await geoplacemarkService.deleteAllRatings();
        await geoplacemarkService.deleteAllUsers();
        u = await geoplacemarkService.createUser(testApiUsers[2]);
        await geoplacemarkService.authenticate(testCredentials[2]);
        for (let i = 0; i < testPois.length; i +=1) {
            testUsers[i] = await geoplacemarkService.createUser(testUsers[i])
            testPois[i].userid = testUsers[i]._id
            testPois[i].author = testUsers[i].firstName + testUsers[i].surname
            testPois[i].iconAddress = "an icon address"
            testPois[i] = await geoplacemarkService.createPoi(testPois[i])
            const date = new Date()
            testRatings[i].date = date
            testRatings[i] = await geoplacemarkService.createRating(testPois[i]._id, testUsers[i]._id, testRatings[i])
        }
    });

    teardown(async() => {

    });



    test("create a rating", async () => {
        const newRating = await geoplacemarkService.createRating(testPois[0]._id, testUsers[0]._id, testRating)
        assertSubset(newRating, testRating)
        const returnedRatings = await geoplacemarkService.getAllRatings();
        assert.equal(returnedRatings.length, testRatings.length +1)
    } );


    test("get rating by id - success", async() => {
        const rating = await geoplacemarkService.getRatingById(testRatings[0]._id)
        assertSubset(rating, testRating[0])
    });

    test("get a rating by id - fail", async () => {
        try {
          const returnedRating = await geoplacemarkService.getRatingById("1234");
          assert.fail("Should not return a response");
        } catch (error) {
          assert(error.response.data.message === "No rating with this id");
          assert(error.response.data.statusCode, 503)
        }
      });



    test("get ratings by user - success", async() => {
        const ratings = await geoplacemarkService.getRatingByUserId(testUsers[0]._id)
        assert.equal(ratings.length, 1)
    });


    test("get ratings by poi - success", async() => {
        const ratings = await geoplacemarkService.getRatingByPoiId(testPois[0]._id)
        assert.equal(ratings.length, 1)
    });

    test("get a ratings by poi - fail", async () => {
        try {
          const returnedRatings = await geoplacemarkService.getRatingByPoiId("bad id");
          assert.isEmpty(returnedRatings)
        } catch (error) {
          assert(error.response.data.statusCode, 404)
        }
      });

      test("get ratings by value - success", async() => {
        const ratings = await geoplacemarkService.getRatingByValue(testRatings[0].rating)
        assert.equal(ratings.length, 1)
    });

    test("get a ratings by value - fail", async () => {
        try {
          const returnedRatings = await geoplacemarkService.getRatingByValue("bad value");
          assert.isEmpty(returnedRatings)
        } catch (error) {
          assert(error.response.data.statusCode, 404)
        }
      });

    test("get all ratings", async () => {
        const ratings = await geoplacemarkService.getAllRatings()
        assert.equal(testRatings.length, ratings.length)
    });


    test("delete all ratings", async () => {
        await geoplacemarkService.deleteAllRatings()
        const ratings = geoplacemarkService.getAllRatings()
        assert.isEmpty(ratings)
    });

    test("delete rating by id - success", async () => {
        await geoplacemarkService.deleteRatingById(testRatings[1]._id)
       const  ratings = await geoplacemarkService.getAllRatings()
        assert.equal(ratings.length, testRatings.length -1)
    });

    test("delete rating by id - failure bad id", async () => {
        try {
        await geoplacemarkService.deleteRatingById("bad id")
        assert.fail("should not return a response")
    }
    catch (error) {
        assert(error.response.data.message === "No rating found");
        assert(error.response.data.statusCode, 404 )
    }
    });

    test("delete rating by userid - success", async () => {
        await geoplacemarkService.deleteRatingByUserId(testUsers[1]._id)
       const  ratings = await geoplacemarkService.getAllRatings()
        assert.equal(ratings.length, testRatings.length -1)
    });

    test("delete rating by userid - failure bad id", async () => {
        try {
        await geoplacemarkService.deleteRatingByUserId("bad id")
    }
    catch (error) {
        assert(error.response.data.statusCode, 503 )
    }
    });

    test("delete rating by poiid - success", async () => {
        await geoplacemarkService.deleteRatingByPoiId(testPois[0]._id)
        const  ratings = await geoplacemarkService.getAllRatings()
        assert.equal(ratings.length, testRatings.length -1)
    });

    test("delete rating by poiid - failure bad id", async () => {
        try {
        await geoplacemarkService.deleteRatingByPoiId("bad id")
    }
    catch (error) {
        assert(error.response.data.statusCode, 503 )
    }
    });

    test("update a Poi - success", async () => {
        await geoplacemarkService.updateRating(testRatings[0]._id, updatedRating);
        const newDetails = await geoplacemarkService.getRatingById(testRatings[0]._id)
        assertSubset(updatedRating,newDetails )
    });

    test("update a poi - failure bad id", async () => {
        try {
            await geoplacemarkService.updateRating("bad id", updatedRating);
        }
        catch (error){
            assert(error.response.data.statusCode, 404 )
        }
    });

    test("update a user - failure bad user", async () => {
        try{
            await geoplacemarkService.updateRating(testRatings[0]._id, "im not a rating im a string")
        }
        catch (error) {
            assert(error.response.data.message === "Database Error");
            assert(error.response.data.statusCode, 503)
        }
    })
});

