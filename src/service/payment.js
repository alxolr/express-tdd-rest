const { JobsRepository } = require("../repository/jobs");
const { sequelize } = require("../model");

class PaymentService {
  constructor() {
    this.jobRepo = new JobsRepository();
  }

  async pay(jobId) {
    const trx = await sequelize.transaction();

    try {
      const job = await this.jobRepo.getJob(jobId, trx);

      if (!job.paid) {
        if (job.Contract.Client.balance >= job.price) {
          job.Contract.Client.balance -= job.price;
          job.Contract.Contractor.balance += job.price;
          job.paid = 1;
          job.paymentDay = new Date();

          await Promise.all([
            job.Contract.Client.save(),
            job.Contract.Contractor.save(),
            job.save(),
          ]);
        } else {
          throw new Error("The Client balance is not enough");
        }
      } else {
        throw Error("Job already paid");
      }

      await trx.commit();
    } catch (err) {
      await trx.rollback();

      throw err;
    }
  }
}

module.exports = { PaymentService };
