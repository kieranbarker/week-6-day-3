const { beforeEach, describe, expect, it } = require("@jest/globals");
const request = require("supertest");

const app = require("./app.js");
const sequelize = require("./db/connection.js");

// Before each test run, drops the tables and creates them again.
// This gives us a clean slate to work with for each test.
beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("POST /posts", () => {
  it("Creates a new post", async () => {});
});

describe("GET /posts", () => {
  it("Returns an array of posts", async () => {});
});

describe("GET /posts/:postId", () => {
  it("Returns the post with the given ID", async () => {});
  it("Returns a 404 error if the post doesn't exist", async () => {});
});

describe("PUT /posts/:postId", () => {
  it("Creates a new post with the given ID if it doesn't exist", async () => {});
  it("Updates the post with the given ID", async () => {});
});

describe("DELETE /posts/:postId", () => {
  it("Deletes the post with the given ID", async () => {});
  it("Returns a 404 error if the post doesn't exist", async () => {});
});

describe("GET /posts/:postId/comments", () => {
  it("Gets the comments associated with the given post ID", async () => {});
  it("Returns an empty array if the post doesn't exist", async () => {});
});
