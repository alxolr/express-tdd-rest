const router = require("express").Router();

router.post("/deposit/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const transaction = 

    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
