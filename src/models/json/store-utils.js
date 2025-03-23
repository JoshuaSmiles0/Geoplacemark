import { JSONFilePreset } from "lowdb/node";

// Low db lightweight store

export const db = await JSONFilePreset("src/models/json/db.json", {
  users: [],
  pois: [],
  ratings: [],
});