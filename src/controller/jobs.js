const router = require("express").Router();

const { JobsRepository } = require("../repository/jobs");
const { PaymentService } = require("../service/payment");

const paymentService = new PaymentService();
const repository = new JobsRepository();

router.get("/unpaid", async (req, res) => {
  const jobs = await repository.getUnpaidJobs(req.profile.id);

  res.json(jobs);
});

router.post("/:id/pay", async (req, res, next) => {
  const { id } = req.params;

  try {
    await paymentService.pay(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
