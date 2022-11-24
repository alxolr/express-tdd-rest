const { JobsRepository } = require("../repository/jobs");

const router = require("express").Router();
const repository = new JobsRepository();

router.get("/best-profession", async (req, res) => {
  const { start, end } = req.query;

  try {
    let result = await repository.findBestProfession(start, end);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

router.get("/best-clients", async (req, res) => {
  const { start, end, limit } = req.query;

  res.json([]);
});

module.exports = router;
