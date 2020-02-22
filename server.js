const express = require("express");

const server = express();

const projectRoute = require("./projects/projectsRouter");
const actionRoute = require("./actions/actionsRouter");

server.use(express.json());

server.use("/project", projectRoute);
server.use("/action", actionRoute);

server.get("/", (req, res) => {
  res.send(`<h2>API is deployed!</h2>`);
});

module.exports = server;
