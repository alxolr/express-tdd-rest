const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");

const contracts = require("./controller/contracts");
const jobs = require("./controller/jobs");
const balances = require("./controller/balances");
const admin = require("./controller/admin");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/contracts", contracts);
app.use("/jobs", jobs);
app.use("/balances", balances);
app.use("/admin", admin);

module.exports = app;
