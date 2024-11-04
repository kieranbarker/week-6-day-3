const express = require("express");
const routes = require("./routes/index.js");

const app = express();

app.use("/posts", routes.posts);
app.use("/comments", routes.comments);

module.exports = app;
