const router = require("express").Router();
const { ContractsRepository } = require("../repository/contracts");

const repository = new ContractsRepository();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const contract = await repository.findContractOwnedBy(id, req.profile.id);

  if (!contract) return res.status(404).end();
  res.json(contract);
});

router.get("/", async (req, res) => {
  const contracts = await repository.listNonTerminatedContracts(req.profile.id);

  res.json(contracts);
});

module.exports = router;
