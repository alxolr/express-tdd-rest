const router = require("express").Router();
const { Op } = require("sequelize");

router.get("/:id", async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;

  const query = {
    where: {
      [Op.and]: {
        id,
        [Op.or]: { ContractorId: req.profile.id, ClientId: req.profile.id },
      },
    },
  };

  const contract = await Contract.findOne(query);

  if (!contract) return res.status(404).end();
  res.json(contract);
});

router.get("/", async (req, res) => {
  const { Contract } = req.app.get("models");

  const query = {
    where: {
      [Op.and]: {
        status: { [Op.not]: "terminated" },
        [Op.or]: { ContractorId: req.profile.id, ClientId: req.profile.id },
      },
    },
  };

  const contracts = await Contract.findAll(query);

  res.json(contracts);
});

module.exports = router;
