import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { testU, testUsers,updatedUser, testPoi, testPois, updatedPoi } from "../apiFixtures.js";
import { geoplacemarkService } from "./geoplacemark-service.js";




suite("Poi API tests", () => {
setup(async () => {
        geoplacemarkService.clearAuth()
        let u = await geoplacemarkService.createUser(updatedUser)
        await geoplacemarkService.authenticate(u)
        await geoplacemarkService.deleteAllPois();
        await geoplacemarkService.deleteAllUsers();
        u = await geoplacemarkService.createUser(updatedUser);
        await  geoplacemarkService.authenticate(u);
        for (let i = 0; i < testPois.length; i +=1) {
            testUsers[i] = await geoplacemarkService.createUser(testUsers[i])
            testPois[i].userid = testUsers[i]._id
            testPois[i].author = testUsers[i].firstName + testUsers[i].surname
            testPois[i].iconAddress = "an icon address"
            testPois[i] = await geoplacemarkService.createPoi(testPois[i])
        }
    });

    teardown(async() => {

    });


    test("create a poi", async () => {
        const newPoi = await geoplacemarkService.createPoi(testPoi)
        assertSubset(newPoi, testPoi)
        const returnedPois = await geoplacemarkService.getAllPois();
        assert.equal(returnedPois.length, testPois.length +1)
    } );


    test("get poi by id - success", async() => {
        const poi = await geoplacemarkService.getPoiById(testPois[0]._id)
        assert.deepEqual(poi, testPois[0])
    });

    test("get a poi by id - fail", async () => {
        try {
          const returnedPoi = await geoplacemarkService.getPoiById("1234");
          assert.fail("Should not return a response");
        } catch (error) {
          assert(error.response.data.message === "No Poi with this id");
          assert(error.response.data.statusCode, 503)
        }
      });

    test("get a poi by id - failure non existant id", async () => {
        await geoplacemarkService.deleteAllPois();
        try {
            const returnedPoi = await geoplacemarkService.getPoiById(testPois[0]._id)
            assert.fail("should not return a response")
        }
        catch (error) {
            assert(error.response.data.message === "No Poi with this id");
            assert(error.response.data.statusCode, 404 )
        }

    });

    test("get poi by user - success", async() => {
        const pois = await geoplacemarkService.getPoiByUserId(testUsers[0]._id)
        assert.equal(pois.length, 1)
    });


    test("get a poi by user - failure non existant user", async () => {
        await geoplacemarkService.deleteAllUsers();
        try{
            const returnedPoi = await geoplacemarkService.getPoiById(updatedUser._id)
            assert.isEmpty(returnedPoi)
        }
        catch (error) {
            assert(error.response.data.statusCode, 404)
        }
            


    });

    test("get poi by type - success", async() => {
        const pois = await geoplacemarkService.getPoiByType(testPois[0].type)
        assert.equal(pois.length, 1)
    });

    test("get a poi by type - fail", async () => {
        try {
          const returnedPoi = await geoplacemarkService.getPoiByType("bad type");
          assert.isEmpty(returnedPoi)
        } catch (error) {
          assert(error.response.data.statusCode, 404)
        }
      });

    test("get all pois", async () => {
        const pois = await geoplacemarkService.getAllPois()
        assert.equal(testPois.length, pois.length)
    });


    test("delete all pois", async () => {
        await geoplacemarkService.deleteAllUsers()
        const pois = geoplacemarkService.getAllPois()
        assert.isEmpty(pois)
    });

    test("delete Poi by id - success", async () => {
        await geoplacemarkService.deletePoiById(testPois[1]._id)
       const  pois = await geoplacemarkService.getAllPois()
        assert.equal(pois.length, testPois.length -1)
    });

    test("delete poi by id - failure bad id", async () => {
        try {
        await geoplacemarkService.deletePoiById("bad id")
        assert.fail("should not return a response")
    }
    catch (error) {
        assert(error.response.data.message === "No Poi found");
        assert(error.response.data.statusCode, 404 )
    }
    });

    test("delete Poi by userid - success", async () => {
        await geoplacemarkService.deletePoiByUserId(testUsers[1]._id)
       const  pois = await geoplacemarkService.getAllPois()
        assert.equal(pois.length, testPois.length -1)
    });

    test("delete poi by userid - failure bad id", async () => {
        try {
        await geoplacemarkService.deletePoiByUserId("bad id")
    }
    catch (error) {
        assert(error.response.data.statusCode, 503 )
    }
    });

    test("update a Poi - success", async () => {
        await geoplacemarkService.updatePoi(testPois[0]._id, updatedPoi);
        const newDetails = await geoplacemarkService.getPoiById(testPois[0]._id)
        assertSubset(updatedPoi,newDetails )
    });

    test("update a poi - failure bad id", async () => {
        try {
            await geoplacemarkService.updatePoi("bad id", updatedPoi);
        }
        catch (error){
            assert(error.response.data.statusCode, 404 )
        }
    });

    test("update a poi - failure bad user", async () => {
        try{
            await geoplacemarkService.updatePoi(testPois[0]._id, "im not a poi im a string")
        }
        catch (error) {
            assert(error.response.data.statusCode, 503)
        }
    })




});
