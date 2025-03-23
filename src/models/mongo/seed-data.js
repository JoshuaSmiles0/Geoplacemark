import dotenv from "dotenv";

// Seed data for mongodb, contains the admin user
// and a test object of each type

const date = new Date();

export const seedData = {
    users: {
      _model: "User",
      admin: {
        firstName: "Admin",
        surname: "Admin",
        email: "admin@geoplacemark.com",
        password: "@dmin&ge0placemark"
      },
      test: {
        firstName: "Test",
        surname: "User",
        email: "TestUser@geoplacemark.com",
        password: "1234"
      },
    },
    sites: {
      _model: "Poi",
      testLocation: {
        location: "Test",
        lat: "52.253974",
        long: "-7.117011",
        type: "economic",
        description: "My favourite place in the world",
        userid: "->users.test",
        author: "Test User",
        iconAddress: "/images/economicLocation.jpg"
      }
    },
    ratings: {
      _model: "Rating",
      testRating: {
        comment: "Really Really Loved this place",
        rating: "5",
        ratingIconAddress: "/images/fiveStar.png",
        date: date,
        user: "Test User",
        locationName: "Test",
        poiid: "->sites.testLocation",
        userid: "->users.test"

      }
    }
  };
  
