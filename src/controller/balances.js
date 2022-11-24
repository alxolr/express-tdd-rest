const { DepositService } = require("../service/deposit");

const router = require("express").Router();

const depositService = new DepositService();

router.post("/deposit/:clientId", async (req, res, next) => {
  const { clientId } = req.params;
  const { amount } = req.body;

  try {
    await depositService.deposit(clientId, amount);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
