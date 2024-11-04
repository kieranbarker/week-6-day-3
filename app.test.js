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
  it("Creates a new post", async () => {
    const response = await request(app).post("/posts").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Hello, World",
      body: "This is my first post",
    });
  });
});

describe("GET /posts", () => {
  it("Returns an array of posts", async () => {
    await request(app).post("/posts").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    await request(app).post("/posts").send({
      title: "Howdy, World",
      body: "This is my second post",
    });

    await request(app).post("/posts").send({
      title: "Ahoy, World",
      body: "This is my third post",
    });

    const response = await request(app).get("/posts");
    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        title: "Hello, World",
        body: "This is my first post",
      }),
      expect.objectContaining({
        title: "Howdy, World",
        body: "This is my second post",
      }),
      expect.objectContaining({
        title: "Ahoy, World",
        body: "This is my third post",
      }),
    ]);
  });
});

describe("GET /posts/:postId", () => {
  it("Returns the post with the given ID", async () => {
    await request(app).post("/posts").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    const response = await request(app).get("/posts/1");
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      id: 1,
      title: "Hello, World",
      body: "This is my first post",
    });
  });

  it("Returns a 404 error if the post doesn't exist", async () => {
    const response = await request(app).get("/posts/1");
    expect(response.status).toBe(404);
  });
});

describe("PUT /posts/:postId", () => {
  it("Creates a new post with the given ID if it doesn't exist", async () => {
    const response = await request(app).put("/posts/1").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      title: "Hello, World",
      body: "This is my first post",
    });
  });

  it("Updates the post with the given ID", async () => {
    await request(app).put("/posts/1").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    const response = await request(app).put("/posts/1").send({
      body: "This is my 1st post",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: "Hello, World",
      body: "This is my 1st post",
    });
  });
});

describe("DELETE /posts/:postId", () => {
  it("Deletes the post with the given ID", async () => {
    await request(app).put("/posts/1").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    const response = await request(app).delete("/posts/1");
    expect(response.status).toBe(204);
  });

  it("Returns a 404 error if the post doesn't exist", async () => {
    const response = await request(app).delete("/posts/1");
    expect(response.status).toBe(404);
  });
});

describe("GET /posts/:postId/comments", () => {
  it("Gets the comments associated with the given post ID", async () => {
    await request(app).put("/posts/1").send({
      title: "Hello, World",
      body: "This is my first post",
    });

    await request(app).put("/comments/1").send({
      PostId: 1,
      name: "Kieran Barker",
      email: "kieran.barker@multiverse.io",
      body: "This is cool",
    });

    await request(app).put("/comments/2").send({
      PostId: 1,
      name: "Kieran Barker",
      email: "kieran.barker@multiverse.io",
      body: "Thanks for sharing",
    });

    await request(app).put("/comments/3").send({
      PostId: 1,
      name: "Kieran Barker",
      email: "kieran.barker@multiverse.io",
      body: "I've never seen this before",
    });

    const response = await request(app).get("/posts/1/comments");
    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        id: 1,
        PostId: 1,
        name: "Kieran Barker",
        email: "kieran.barker@multiverse.io",
        body: "This is cool",
      }),
      expect.objectContaining({
        id: 2,
        PostId: 1,
        name: "Kieran Barker",
        email: "kieran.barker@multiverse.io",
        body: "Thanks for sharing",
      }),
      expect.objectContaining({
        id: 3,
        PostId: 1,
        name: "Kieran Barker",
        email: "kieran.barker@multiverse.io",
        body: "I've never seen this before",
      }),
    ]);
  });

  it("Returns an empty array if the post doesn't exist", async () => {
    const response = await request(app).get("/posts/1/comments");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
