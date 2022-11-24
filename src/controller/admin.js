const { fullNameMapper } = require("../mapper");
const { JobsRepository } = require("../repository/jobs");

const router = require("express").Router();
const repository = new JobsRepository();

router.get("/best-profession", async (req, res) => {
  const { start, end } = req.query;

  let result = await repository.findBestProfession(start, end);

  if (!result) return res.status(404).end();

  return res.json(result);
});

router.get("/best-clients", async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const clients = await repository.findBestPayingClients(start, end, limit);
    res.json(clients.map(fullNameMapper));
  } catch (err) {
    throw err;
  }
});

module.exports = router;
